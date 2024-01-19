import { Controller, Get, Post, Delete, Patch, Body, Param, Query } from '@nestjs/common';
import FriendsService from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private friendsService: FriendsService) { }

	// get list of friends of user
	@Post('get')
	async getFriends(@Body('userId') userId: string) {
		return this.friendsService.getFriends(userId);
	}

	// create friendship
	@Post('add')
	async addFriend(@Body('userId') userId: string, @Body('friendId') friendId: string) {
		return this.friendsService.addFriend(userId, friendId);
	}

	@Post('user')
	async getUser(@Body('username') username: string) {
		return this.friendsService.getUser(username);
	}

	@Get('users')
	async getUsers() {
		return this.friendsService.getUsers();
	}

	// delete friendship
	@Delete('delete')
	async deleteFriend(@Body('userId') userId: string, @Body('friendId') friendId: string) {
		return this.friendsService.deleteFriend(userId, friendId);
	}

	// send message
	@Post('message')
	async sendMessage(@Body('friendshipId') friendshipId: string, @Body('senderId') senderId: string, @Body('content') content: string) {
		return this.friendsService.sendMessage(friendshipId, senderId, content);
	}

	// get friendship messages (for the private chat between them)
	@Get('messages/:friendshipId')
	async getFriendshipMessages(@Param('friendshipId') friendshipId: string) {
		return this.friendsService.getFriendshipMessages(friendshipId);
	}

	// block friend
	@Post('block')
	async blockUser(@Body('userId') userId: string, @Body('blockedId') blockedId: string) {
		return this.friendsService.blockUser(userId, blockedId);
	}

	// unblock friend
	@Patch('unblock')
	async unblockUser(@Body('userId') userId: string, @Body('blockedId') blockedId: string) {
		return this.friendsService.unblockUser(userId, blockedId);
	}

	// get list of blocked users for a user
	@Get('blocked-users/:userId')
	async getBlockedUsers(@Param('userId') userId: string) {
		return this.friendsService.getBlockedUsers(userId);
	}

	// get friendship document from current user and friend usernames
	@Get('friendship')
	async getFriendship(@Query('currentUserId') currentUserId: string, @Query('friendUserId') friendUserId: string) {
		return this.friendsService.getFriendship(currentUserId, friendUserId);
	}

	// get friendship document from current user and friend usernames
	@Get(':friendshipId/exist')
	async getFriendshipExist(@Param('friendshipId') friendshipId: string) {
		return this.friendsService.getFriendshipFromId(friendshipId);
	}

	// fetch pending friend requests
	@Get('friend-requests/:userId')
	async fetchFriendRequests(@Param('userId') userId: string) {
		return this.friendsService.fetchFriendRequests(userId);
	}

	// accept a friend request
	@Post('friend-requests/accept')
	async acceptFriendRequest(@Body('userId') userId: string, @Body('friendRequestId') friendRequestId: string) {
		return this.friendsService.acceptFriendRequest(userId, friendRequestId);
	}

	// decline a friend request
	@Delete('friend-requests/decline')
	async declineFriendRequest(@Body('userId') userId: string, @Body('friendRequestId') friendRequestId: string) {
		return this.friendsService.declineFriendRequest(userId, friendRequestId);
	}

	@Get('are-friends')
	async areUsersFriends(@Query('userId1') userId1: string, @Query('userId2') userId2: string) {
		return this.friendsService.areTheyFriends(userId1, userId2);
	}
}
