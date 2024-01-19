import { Injectable } from "@nestjs/common";
import DatabaseService from "src/database/database.service";

@Injectable()
export default class FriendsService {
	constructor(private databaseService: DatabaseService) { }

	async getFriends(userId: string) {
		const user = await this.databaseService.user.findUnique({
			where: { id: userId },
			include: {
				initiatedFriendships: {
					select: {
						user2: {
							select: {
								id: true,
								username: true,
								email: true,
								status: true,
								avatar: true
							}
						}
					}
				},
				acceptedFriendships: {
					select: {
						user1: {
							select: {
								id: true,
								username: true,
								email: true,
								status: true,
								avatar: true
							}
						}
					}
				}
			}
		});

		if (!user)
			return { ok: false, msg: "User not found" };

		const initiatedFriends = user?.initiatedFriendships.map(friendship => friendship.user2) || [];
		const acceptedFriends = user?.acceptedFriendships.map(friendship => friendship.user1) || [];

		const allFriends = [...initiatedFriends, ...acceptedFriends];

		if (allFriends.length === 0) {
			return { ok: false, msg: "User has no friend" };
		}
	
		
		return allFriends;
	}

	async addFriend(userId: string, friendId: string) {
		// Fetch the friend's blocked users
		const friend = await this.databaseService.user.findUnique({
			where: { id: friendId },
			select: {
				blockedFriends: true
			}
		});

		// Check if the friend has blocked the user
		if (friend && friend.blockedFriends.includes(userId)) {
			return { blocked: true };
		}

		// Check if there is an existing friend request
		const existingRequest = await this.databaseService.friendRequest.findFirst({
			where: {
				OR: [
					{ requesterId: userId, requesteeId: friendId },
					{ requesterId: friendId, requesteeId: userId }
				]
			}
		});

		if (existingRequest) {
			return { alreadyRequested: true };
		}

		// Check if they are already friends
		const existingFriendship = await this.databaseService.friendship.findFirst({
			where: {
				OR: [
					{ user1Id: userId, user2Id: friendId },
					{ user1Id: friendId, user2Id: userId }
				]
			}
		});

		if (existingFriendship) {
			return { alreadyFriends: true };
		}

		// Create a new friend request
		return this.databaseService.friendRequest.create({
			data: {
				requesterId: userId,
				requesteeId: friendId
			}
		});
	}

	async getUser(username: string) {
		const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		const formatUserName = (username: string) => {
			return removeAccents(username.toLowerCase().replace(/[ ']/g, '-'))
		}
		const users = await this.databaseService.user.findMany();
		for (const user of users) {
			if (formatUserName(user.username) === formatUserName(username)) {
				return user;
			}
		}
		return null;
	}

	async getUsers() {
		return this.databaseService.user.findMany();
	}

	async deleteFriend(userId: string, friendId: string) {
		const friendship = await this.databaseService.friendship.findFirst({
			where: {
				OR: [
					{ user1Id: userId, user2Id: friendId },
					{ user1Id: friendId, user2Id: userId }
				]
			},
			select: {
				id: true
			}
		});

		if (!friendship) {
			return { error: "Friendship not found" };
		}

		await this.databaseService.friendMessage.deleteMany({
			where: {
				friendshipId: friendship.id
			}
		});

		return this.databaseService.friendship.delete({
			where: {
				id: friendship.id
			}
		});
	}

	async blockUser(userId: string, blockedId: string) {
		await this.deleteFriend(userId, blockedId);

		return this.databaseService.user.update({
			where: { id: userId },
			data: {
				blockedFriends: {
					push: blockedId
				}
			}
		});
	}

	async unblockUser(userId: string, blockedId: string) {
		const user = await this.databaseService.user.findUnique({
			where: { id: userId }
		});
		const updatedBlockedUsers = (user?.blockedFriends || []).filter(id => id !== blockedId);

		return this.databaseService.user.update({
			where: { id: userId },
			data: {
				blockedFriends: {
					set: updatedBlockedUsers
				}
			}
		});
	}

	async getBlockedUsers(userId: string) {
		const user = await this.databaseService.user.findUnique({
			where: { id: userId },
			select: {
				blockedFriends: true
			}
		});

		return user?.blockedFriends || [];
	}

	async sendMessage(friendshipId: string, senderId: string, content: string) {
		const exist = await this.databaseService.friendship.findUnique({
			where: { id: friendshipId },
			select: { id: true }
		});

		if (!exist) {
			return { ok: false };
		}

		return this.databaseService.friendMessage.create({
			data: {
				content: content,
				senderId: senderId,
				friendshipId: friendshipId
			},
			include: {
				sender: true
			}
		});
	}

	async getFriendshipMessages(friendshipId: string) {
		return await this.databaseService.friendMessage.findMany({
			where: { friendshipId: friendshipId },
			orderBy: {
				createdAt: 'asc'
			},
			include: {
				sender: true
			}
		});
	}

	async getFriendship(currentUserId: string, friendUserId: string) {
		const friendship = await this.databaseService.friendship.findFirst({
			where: {
				OR: [
					{
						user1Id: currentUserId,
						user2Id: friendUserId
					},
					{
						user1Id: friendUserId,
						user2Id: currentUserId
					}
				]
			}
		});

		return friendship ? friendship : { exist: false };
	}

	async getFriendshipFromId(friendshipId: string) {
		const friendship = await this.databaseService.friendship.findFirst({
			where: {
				id: friendshipId
			}
		});

		return friendship ? { exist: true } : { exist: false };
	}

	async updateUserStatus(userId: string, status: 'online' | 'offline' | 'ingame') {
		const user = await this.databaseService.user.update({
			where: { id: userId },
			data: { status },
		});
		if (!user)
			return { error: 'Error updating user status:', ok: false };
		return { user, ok: true };
	}

	async acceptFriendRequest(userId: string, friendRequestId: string) {
		const request = await this.databaseService.friendRequest.findUnique({
			where: { id: friendRequestId }
		});

		if (request && request.requesteeId === userId) {
			// Create a new friendship
			await this.databaseService.friendship.create({
				data: {
					user1Id: request.requesterId,
					user2Id: request.requesteeId
				}
			});

			// Delete the friend request
			await this.databaseService.friendRequest.delete({
				where: { id: friendRequestId }
			});

			return { ok: true };
		}

		return { ok: false };
	}

	async declineFriendRequest(userId: string, friendRequestId: string) {
		const request = await this.databaseService.friendRequest.findUnique({
			where: { id: friendRequestId }
		});

		if (request && request.requesteeId === userId) {
			// Delete the friend request
			await this.databaseService.friendRequest.delete({
				where: { id: friendRequestId }
			});

			return { ok: true };
		}

		return { ok: false };
	}

	async fetchFriendRequests(userId: string) {
		const pendingRequests = await this.databaseService.friendRequest.findMany({
			where: {
				requesteeId: userId,
			},
			include: {
				requester: {
					select: {
						id: true,
						username: true,
					}
				}
			}
		});

		return pendingRequests;
	}

	async areTheyFriends(userId1: string, userId2: string) {
		// Check if there is an existing friendship between the two users
		const existingFriendship = await this.databaseService.friendship.findFirst({
			where: {
				OR: [
					{ user1Id: userId1, user2Id: userId2 },
					{ user1Id: userId2, user2Id: userId1 }
				]
			}
		});
	
		// Return true if they are friends, false otherwise
		return !!existingFriendship;
	}
}


