import { Controller, Post, Patch, Get, Delete, Body, Param } from '@nestjs/common';
import ChatService from './chat.service';
import { ChatType } from '@prisma/client';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	// create new chat
	@Post('create')
	async createChat(
		@Body('type') type: ChatType,
		@Body('name') name: string,
		@Body('userId') userId: string,
		@Body('password') password?: string
	) {
		return this.chatService.createChat(type, name, userId, password);
	}

	// get a chat
	@Get(':chatId')
	async getChat(@Param('chatId') chatId: string) {
		return this.chatService.getChat(chatId);
	}

	// add a new member in chat
	@Post(':chatId/member')
	async addMember(
		@Param('chatId') chatId: string,
		@Body('userId') userId: string
	) {
		return this.chatService.addMember(chatId, userId);
	}

	// delete a member in chat
	@Delete(':chatId/member')
	async deleteMember(
		@Param('chatId') chatId: string,
		@Body('userId') userId: string
	) {
		return this.chatService.deleteMember(chatId, userId);
	}

	// delete a chat
	@Delete(':chatId')
	async deleteChat(@Param('chatId') chatId: string, @Body('userId') userId: string) {
		return this.chatService.deleteChat(chatId, userId);
	}

	// send a message in chat
	@Post('send-message')
	async sendMessage(
		@Body('chatId') chatId: string,
		@Body('userId') userId: string,
		@Body('content') content: string
	) {
		return this.chatService.createMessage(chatId, userId, content);
	}

	// update name of chat
	@Patch(':chatId/name')
	async updateChatName(
		@Param('chatId') chatId: string,
		@Body('newChatName') newChatName: string,
		@Body('userId') userId: string
	) {
		return this.chatService.updateChatName(chatId, newChatName, userId);
	}

	// update password of chat
	@Patch(':chatId/password')
	async updateChatPassword(
		@Param('chatId') chatId: string,
		@Body('newPassword') newPassword: string,
		@Body('userId') userId: string 
	) {
		return this.chatService.updateChatPassword(chatId, newPassword, userId);
	}

	// ban a user in chat
	@Post(':chatId/ban/:targetUserId')
	async banUser(
		@Param('chatId') chatId: string,
		@Body('adminUserId') adminUserId: string,
		@Param('targetUserId') targetUserId: string,
	) {
		return this.chatService.banUserFromChat(chatId, adminUserId, targetUserId);
	}

    @Patch(':chatId/unban/:targetUserId')
    async unbanUserFromChat(
        @Param('chatId') chatId: string,
        @Body('adminUserId') adminUserId: string,
        @Param('targetUserId') targetUserId: string
    ) {
        return this.chatService.unbanUserFromChat(chatId, adminUserId, targetUserId);
    }

	// get all chats user is in
	@Get(':userId/get-chats')
	async getUserChats(@Param('userId') userId: string) {
		return this.chatService.getChats(userId);
	}

	// get  chats
	@Get('all/:userId')
	async getAllChats(@Param('userId') userId: string) {
		return this.chatService.getAllChats(userId);
	}

	// get every messages of a chat
	@Get(':chatId/messages')
	async getChatMessages(@Param('chatId') chatId: string) {
		return this.chatService.getMessages(chatId);
	}
	

	// get every members of a chat
	@Get(':chatId/members')
	async getChatMembers(
		@Param('chatId') chatId: string,
	) {
		return this.chatService.getMembers(chatId);
	}
	

	// kick a user in a chat
	@Delete(':chatId/kick/:targetUserId')
	async kickUser(
		@Param('chatId') chatId: string,
		@Body('adminUserId') adminUserId: string,
		@Param('targetUserId') targetUserId: string
	) {
		return this.chatService.kickUserFromChat(chatId, adminUserId, targetUserId);
	}
	

	// add user in the invite list of chat
	@Post(':chatId/invite/:targetUserId')
	async inviteUser(
		@Param('chatId') chatId: string,
		@Body('inviterUserId') inviterUserId: string,
		@Param('targetUserId') targetUserId: string
	) {
		return this.chatService.inviteUserToChat(chatId, inviterUserId, targetUserId);
	}

	// add user in the invite list of chat
    @Patch(':chatId/uninvite/:targetUserId')
    async uninviteUserFromChat(
        @Param('chatId') chatId: string,
        @Body('inviterUserId') inviterUserId: string,
        @Param('targetUserId') targetUserId: string
    ) {
        return this.chatService.uninviteUserFromChat(chatId, inviterUserId, targetUserId);
    }
	
	// mute a member in chat
	@Patch(':chatId/mute/:targetUserId')
	async muteUser(
		@Param('chatId') chatId: string,
		@Body('adminUserId') adminUserId: string,
		@Param('targetUserId') targetUserId: string,
		@Body('muteDuration') muteDuration: number
	) {
		return this.chatService.muteMember(chatId, adminUserId, targetUserId, muteDuration);
	}
	
	// check if a member is muted
	@Get(':chatId/is-muted/:userId')
	async checkIfMuted(
		@Param('chatId') chatId: string,
		@Param('userId') userId: string
	) {
		return this.chatService.isMuted(chatId, userId);
	}
	

	// unmute a member in chat
	@Patch(':chatId/unmute/:targetUserId')
	async unmuteMember(
		@Param('chatId') chatId: string,
		@Body('adminUserId') adminUserId: string,
		@Param('targetUserId') targetUserId: string
	) {
		return this.chatService.unmuteMember(chatId, adminUserId, targetUserId);
	}

	// Set a member as admin
    @Post(':chatId/setAdmin/:targetUserId')
    async setMemberAsAdmin(
		@Param('chatId') chatId: string,
		@Body('adminUserId') adminUserId: string,
		@Param('targetUserId') targetUserId: string
	) {
        return this.chatService.setMemberAsAdmin(chatId, adminUserId, targetUserId);
    }

	// check if a member is muted
	@Get(':chatId/banned')
	async getBannedUsers(
		@Param('chatId') chatId: string,
	) {
		return this.chatService.getBannedUsers(chatId);
	}

	// check if a member is muted
	@Get(':chatId/invited')
	async getInvitedUsers(
		@Param('chatId') chatId: string,
	) {
		return this.chatService.getInvitedUsers(chatId);
	}

	// check if a member is muted
	@Get(':chatId/isAdmin/:userId')
	async isAdmin(
		@Param('chatId') chatId: string,
		@Param('userId') userId: string,
	) {
		return this.chatService.isAdmin(chatId, userId);
	}
}
