import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import DatabaseService from "src/database/database.service";
import UserService from "src/user/user.service";

@Injectable()
export default class GameService {

  public user : Map<string, { Socket: Socket, userId: string, name: string, opponent_socket_id: string, 
    opponent_id: string, points_me: number, points_opponent: number, game_id: string, invite_mode: boolean}> = new Map();
	constructor(private databaseService: DatabaseService, private UserService: UserService) {}

	// Create a new game
	async createGame(player1Id: string, player2Id: string) {
		if (player1Id === player2Id) {
		  	return { ok: false, msg: "Players should be different" };
		}
	
		const player1 = await this.databaseService.user.findUnique({
		  	where: { id: player1Id },
		});
	
		const player2 = await this.databaseService.user.findUnique({
		  	where: { id: player2Id },
		});
	
		if (!player1 || !player2) {
		  	return { ok: false, msg: "One or both players not found" };
		}
	
		// Create a new game
		const newGame = await this.databaseService.game.create({
			data: {
				player1Id,
				player2Id,
				player1Score: 0,
				player2Score: 0,
			},
		});
		return newGame.id;
	}

	// Update user wins
	async updateUserWins(userId: string) {
		const user = await this.databaseService.user.findUnique({
		  	where: { id: userId },
		});
	
		if (!user) {
		  	return { ok: false, msg: "User not found" };
		}
	
		return this.databaseService.user.update({
		  	where: { id: userId },
		  	data: { wins: { increment: 1 } },
		});
	  }

	// Update user losses
	async updateUserLosses(userId: string) {
		const user = await this.databaseService.user.findUnique({
		  	where: { id: userId },
		});
	
		if (!user) {
		  	return { ok: false, msg: "User not found" };
		}
	
		return this.databaseService.user.update({
			where: { id: userId },
			data: { losses: { increment: 1 } },
		});
	  }
	

	// Update user points
	async updateUserPoints(userId: string, points: number) {
		const user = await this.databaseService.user.findUnique({
		  	where: { id: userId },
		});
	
		if (!user) {
		  	return { ok: false, msg: "User not found" };
		}
	
		return this.databaseService.user.update({
			where: { id: userId },
			data: { points: { increment: points } },
		});
	}

	// Update the game score
	async updateGameScore(gameId: string, playerWhoScoredId: string) {
		const game = await this.databaseService.game.findUnique({
			where: { id: gameId },
		});

		if (!game) {
			return { ok: false, msg: "Game not found" };
		}

		if (game.player1Id == playerWhoScoredId) {
			return this.databaseService.game.update({
				where: { id: gameId },
				data: {
					player1Score: {increment: 1 },
				},
			});
		}
		else {
			return this.databaseService.game.update({
				where: { id: gameId },
				data: {
					player2Score: {increment: 1 },
				},
			});

		}
	}

	async getUserAndGamesByUsername(username: string) {
		const user = await this.databaseService.user.findUnique({
			where: { username: username },
			include: {
				gamesAsPlayer1: {
					include: {
						player1: true,
						player2: true
					}
				},
				gamesAsPlayer2: {
					include: {
						player1: true,
						player2: true
					}
				}
			}
		});
	
		return user;
	}

	// Get game information by game Id
	async getGameById(gameId: string) {
		const game = await this.databaseService.game.findUnique({
			where: { id: gameId },
		});
		
		if (!game) {
			return { ok: false, msg: "Game not found"};
		}
		return game;
	}

	// find opponent for the game and set data
  async handleUsername(client: Socket, payload: {username: string, userId: string, opponent_id: string}) {
	await this.UserService.changeUserStatus(payload.userId, "ingame");
    if (payload.opponent_id != undefined)
       this.user.set(client.id, { Socket: client, userId: payload.userId, name: payload.username, opponent_socket_id: "", opponent_id: payload.opponent_id, points_me: 0, points_opponent: 0, game_id: "", invite_mode: true});
    else
       this.user.set(client.id, { Socket: client, userId: payload.userId, name: payload.username, opponent_socket_id: "", opponent_id: "", points_me: 0, points_opponent: 0, game_id: "", invite_mode: false});
    let currentSize = this.user.size;
    let Client;
    let opponentClient;
    while (currentSize >= 0)
    {
        const EntryKey = Array.from(this.user.keys())[currentSize]; 
        opponentClient = this.user.get(EntryKey);
        if (opponentClient != undefined && opponentClient.name == payload.username)
           Client = opponentClient;
        if (opponentClient != undefined && opponentClient.opponent_socket_id == "" && opponentClient.name != payload.username && ((payload.opponent_id == undefined && opponentClient.opponent_id == "" && !opponentClient.invite_mode) || (payload.opponent_id == opponentClient.userId && opponentClient.opponent_id == payload.userId)))
        {
           opponentClient.opponent_socket_id = client.id;
           opponentClient.opponent_id = payload.userId;
           client.emit('opponent', {opponent_name: opponentClient.name, opponent_id: opponentClient.userId });
           opponentClient.Socket.emit('opponent', {opponent_name: payload.username, opponent_id: payload.userId});
           let player = this.user.get(client.id);
           const gameId = await this.createGame(payload.userId, opponentClient.userId);
           if (player != undefined && typeof gameId === 'string')
           {
               player.opponent_socket_id = opponentClient.Socket.id;
               player.game_id = gameId;
               opponentClient.game_id = gameId;
           }
           break;
        }
        currentSize--;
    }
    if (Client != undefined && opponentClient!= undefined && Client.userId != opponentClient.userId)
       Client.opponent_id = opponentClient.userId;
  } 

  // start game in multipayer mode
  async handleStartGame(client: Socket, payload: {date: number, go: number, win: boolean, points_me: number, points_opponent: number}) {
    for (const [key, value] of this.user.entries()) {
        if (value.Socket === client) {
            value.points_me = payload.points_me;
            value.points_opponent = payload.points_opponent;
			await this.UserService.changeUserStatus(value.userId, "ingame");
            if (payload.win === true)
            {
               this.updateGameScore(value.game_id, value.userId);
               payload.win = false;
            }
            else if (payload.win === false)
            {
               this.updateGameScore(value.game_id, value.opponent_id);
               payload.win = true;
            }
            for (const [key, valu] of this.user.entries()) {
                if (valu.Socket.id === value.opponent_socket_id)
                {
				await this.UserService.changeUserStatus(valu.userId, "ingame");
                   valu.points_me = payload.points_opponent;
                   valu.points_opponent = payload.points_me;
                   if (payload.points_me >= 2 || payload.points_opponent >= 2)
                   {
                       if (payload.points_me > payload.points_opponent)
                       {
                           this.updateUserWins(value.userId);
                           this.updateUserLosses(value.opponent_id);
                           this.updateUserPoints(value.userId, 3);
                           this.updateUserPoints(value.opponent_id, -2);
                       }
                       else
                       {
                           this.updateUserWins(value.opponent_id);
                           this.updateUserLosses(value.userId);
                           this.updateUserPoints(value.opponent_id, 3);
                           this.updateUserPoints(value.userId, -2);
                       }
                       value.points_me = 0;
                       value.points_opponent = 0;
                       valu.points_me = 0;
                       valu.points_opponent = 0;
                   }
                   valu.Socket.emit('start', payload);
                }
            }
          break;
        }
    }
  }

  // Handle disconnection of the game
  async disconnect(client: Socket)
  {
    let foundKey = null;
        for (const [key, value] of this.user.entries()) {
            if (value.Socket === client) {
                if (value.points_me > 0 || value.points_opponent > 0)
                {
                    this.updateUserWins(value.opponent_id);
                    this.updateUserLosses(value.userId);
                    this.updateUserPoints(value.userId, -2);
                    this.updateUserPoints(value.opponent_id, 3);
                }
                foundKey = key;
                for (const [key, valu] of this.user.entries()) {
                    if (valu.Socket.id === value.opponent_socket_id)
                    {
                        valu.Socket.emit("opponent", {opponent_name: "", opponent_id: ""})
                        valu.opponent_socket_id = "";
                        valu.opponent_id = "";
                        valu.points_me = 0;
                        valu.points_opponent = 0;
                    }
                }
                this.user.delete(foundKey);
                break;
            }
        }
  }
}
