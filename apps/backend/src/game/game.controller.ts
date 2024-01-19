import { Controller, Get, Post, Delete, Patch, Body, Param, Query } from '@nestjs/common';
import GameService from './game.service';

@Controller('game')
export class GameController {
	constructor(private gameService: GameService) {}

	// Create a new game
	@Post('create')
	async createGame(@Body('player1Id') player1Id: string, @Body('player2Id') player2Id: string) {
		return this.gameService.createGame(player1Id, player2Id);
	}

	// Update user wins
	@Post('update-wins')
	async updateUserWins(@Body('userId') userId: string) {
		return this.gameService.updateUserWins(userId);
	}

	// Update user losses
	@Post('update-losses')
	async updateUserLosses(@Body('userId') userId: string) {
		return this.gameService.updateUserLosses(userId);
	}

	// Update user points
	@Post('update-points')
	async updateUserPoints(@Body('userId') userId: string, @Body('points') points: number) {
		return this.gameService.updateUserPoints(userId, points);
	}

	// Update game score
    @Patch(':gameId/score')
    async updateGameScore(@Param('gameId') gameId: string, @Body('playerWhoScoredId') playerWhoScoredId: string) {
        return this.gameService.updateGameScore(gameId, playerWhoScoredId);
    }

	// Get user and his games
	@Post('user-games')
	async getUserAndGamesByUsername(@Body('username') username: string) {
		return this.gameService.getUserAndGamesByUsername(username);
	}


	// Get game information by game Id
	@Get(':gameId')
	async getGameById(@Param('gameId') gameId: string) {
		return this.gameService.getGameById(gameId);
	}
}
