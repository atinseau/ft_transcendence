import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import ChatService from "src/chat/chat.service";
import FriendsService from "src/friends/friends.service";
import DatabaseService from "src/database/database.service";
import GameService from '../game/game.service';
import { disconnect } from "process";

@WebSocketGateway({
    cors: {
        origin: process.env.NEXT_PUBLIC_FRONT_URL,
        credentials: true,
    }
})
export class SocketEvents {
    private clientUserMapping = new Map<string, string>();

    @WebSocketServer()
    server: Server;

    constructor(
        private GameService: GameService,
		private chatService: ChatService,
		private friendsService: FriendsService
	) {}

	// connect
    async handleConnection(client: Socket){
        console.log(`client connected: ${client.id}`);
    }

	// disconnect
    async handleDisconnect(client: Socket){
        console.log(`client disconnected: ${client.id}`);
        this.GameService.disconnect(client);

        const userId = this.clientUserMapping.get(client.id);
        if (userId) {
            const user = await this.friendsService.updateUserStatus(userId, 'offline');
            if (user)
                console.log(`Status of ${userId} has been updated to offline`);
                
            this.clientUserMapping.delete(client.id);
        }
    }

	// update status
    @SubscribeMessage('setStatus')
	async handleStatus(client: Socket, payload: { userId: string, status: "online" | "offline" | "ingame" }) {
		const user = await this.friendsService.updateUserStatus(payload.userId, payload.status);
		if (user)
			console.log(`Status of ${payload.userId} has been updated to ${payload.status}`);
		
        this.clientUserMapping.set(client.id, payload.userId);
	}


	// join chat
    @SubscribeMessage('joinChat')
    async handleJoinChat(client: Socket, payload: { chatId: string, password?: string }) {
		console.log(`Client with ID ${client.id} joining chat ${payload.chatId}`);
        client.join(payload.chatId);
        return { event: 'chatJoined', data: `Joined chat with ID ${payload.chatId}` };
    }

	// kick from chat
    @SubscribeMessage('kickUserFromChat')
    async handleKickChat(client: Socket, payload: { chatId: string, adminUserId: string, targetUserId: string }) {
		const isKicked = await this.chatService.kickUserFromChat(payload.chatId, payload.adminUserId, payload.targetUserId);
		if (isKicked) {
			console.log(`Admin with ID ${payload.adminUserId} has kicked ${payload.targetUserId} from chat ${payload.chatId}`);
			client.to(payload.chatId).emit('userKicked', { kickedUserId: payload.targetUserId, chatId: payload.chatId });
		}
        return { event: 'userKicked', data: `Admin with ID ${payload.adminUserId} has kicked ${payload.targetUserId} from chat ${payload.chatId}` };
    }

	// quit chat
    @SubscribeMessage('quitChat')
    handleQuitChat(client: Socket, chatId: string) {
		console.log(`Client with ID ${client.id} left chat with ID ${chatId}`);
        client.leave(chatId);
        return { event: 'chatQuit', data: `Left chat with ID ${chatId}` };
    }

	// send message
    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: { chatId: string, senderId: string, content: string }) {
        try {
            const message = await this.chatService.createMessage(payload.chatId, payload.senderId, payload.content);
            this.server.to(payload.chatId).emit('newMessage', message);
			console.log(`message: \n`, message, `has sent to ${payload.chatId} by ${payload.senderId}`);
            return { event: 'messageSent', data: `Message sent to chat with ID ${payload.chatId}` };
        } catch (error) {
            throw new WsException(`Error sending message: ${error.message}`);
        }
    }

	// force refetch
    @SubscribeMessage('refetch')
    async refetch(client: Socket, payload: { friendId: string}) {
		console.log(`Client with ID ${payload.friendId} has been refetched `);
		this.server.emit('refetch', { userId: payload.friendId });
        return { event: 'refetch', data: `Client with ID ${payload.friendId} has been refetched` };
    }

	// join chat
    @SubscribeMessage('joinFriendship')
    async handleJoinFriendship(client: Socket, friendshipId: string) {
		console.log(`Client with ID ${client.id} join friendship with ID ${friendshipId}`);
        client.join(friendshipId);
        return { event: 'chatJoined', data: `Joined friendship with ID ${friendshipId}` };
    }

	// quit chat
    @SubscribeMessage('quitFriendship')
    handleQuitFriendship(client: Socket, friendshipId: string) {
		console.log(`Client with ID ${client.id} left friendship with ID ${friendshipId}`);
        client.leave(friendshipId);
        return { event: 'chatQuit', data: `Left chat with ID ${friendshipId}` };
    }

	// send message to friend
	@SubscribeMessage('sendFriendMessage')
	async handleSendFriendMessage(client: Socket, payload: { friendshipId: string, senderId: string, content: string }) {
		try {
			const message = await this.friendsService.sendMessage(payload.friendshipId, payload.senderId, payload.content);
			this.server.to(payload.friendshipId).emit('newFriendMessage', message);
			console.log(`message: \n`, message, `has sent to ${payload.friendshipId} by ${payload.senderId}`);
			return { event: 'friendMessageSent', data: `Message sent to friend's chat with ID ${payload.friendshipId}` };
		} catch (error) {
			throw new WsException(`Error sending message to friend: ${error.message}`);
		}
	}

     // Invite to a game
     @SubscribeMessage('inviteFriendToPlay')
     async handleInviteFriendToPlay(client: Socket, payload: {inviter: string, invitee: string}) {
		const inviteeClientId = [...this.clientUserMapping.entries()]
			.find(([, userId]) => userId === payload.invitee)?.[0];

		
		const inviterClientId = [...this.clientUserMapping.entries()]
			.find(([, userId]) => userId === payload.inviter)?.[0];
		
		if (!inviteeClientId) {
			if (inviterClientId)
				this.server.to(inviterClientId).emit('opponentOffline');
			return;
		}
	
		// Emit the game invitation to the invitee's socket client
		this.server.to(inviteeClientId).emit('inviteGame', { userId: payload.inviter });
	}


     // Game has been refused
     @SubscribeMessage('refuseGame')
     async handleRefuseGame(client: Socket, payload: {inviter: string}) {
		const inviterClientId = [...this.clientUserMapping.entries()]
			.find(([, userId]) => userId === payload.inviter)?.[0];
		
		if (!inviterClientId)
			return ;

		this.server.to(inviterClientId).emit('gameRefused');
     }

     // start game in multipayer mode
     @SubscribeMessage('start')
     async handleStartGameEvent(client: Socket, payload: {date: number, go: number, win: boolean, points_me: number, points_opponent: number}) {
        await this.GameService.handleStartGame(client, payload);
     }

     //stop the game when latency
     @SubscribeMessage('stop')
     async handleStopGame(client: Socket, payload: {date: number}) {
         for (const [key, value] of this.GameService.user.entries()) {
             if (value.Socket === client) {
                 for (const [key, valu] of this.GameService.user.entries()) {
                     if (valu.Socket.id === value.opponent_socket_id)
                         valu.Socket.emit('stop', payload);
                 }
                 break;
                 }
         }
     }
 
     // communicate opponent position's
     @SubscribeMessage('position')
     async handlePositionGameEvent(client: Socket, payload: {ball_x: number, ball_z: number, barre_x: number, barre_z: number}) {
         for (const [key, value] of this.GameService.user.entries()) {
             if (value.Socket === client) {
                 for (const [key, valu] of this.GameService.user.entries()) {
                     if (valu.Socket.id === value.opponent_socket_id)
                         valu.Socket.emit('position', payload);
                 }
                 break;
                 }
         }
     }
     
     // find opponent for the game and set data
     @SubscribeMessage('username')
     async handleUsernameEvent(client: Socket, payload: {username: string, userId: string, opponent_id: string}) {
         await this.GameService.handleUsername(client, payload);
     }
}
