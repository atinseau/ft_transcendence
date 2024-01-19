import { Injectable } from "@nestjs/common";
import { ChatType, UserRole } from "@prisma/client";
import DatabaseService from "src/database/database.service";

@Injectable()
export default class ChatService {
	constructor(private databaseService: DatabaseService) {}

	// create chat
	async createChat(type: ChatType, name: string, userId: string, password?: string) {

		const newChat = {
			name,
			type,
			password,
			members: {
				create: {
					userId: userId,
					role: UserRole.creator
				}
			}
		};

		const chat = await this.databaseService.chat.create({ data: newChat });
		return chat;
	}

	// Get all the chat where user is a member of 
	async getUserChats(userId: string) {
		const userChats = await this.databaseService.member.findMany({
			where: {
				userId: userId
			},
				include: {
				chat: true
			}
		});

		return userChats.map((uc: any) => uc.chat);
	}

	// Get all chats (public, private or protected) and not already a member of
	async getChats(userId: string) {
		// First, get all chat IDs where the user is a member
		const userChats = await this.databaseService.member.findMany({
			where: {
				userId: userId
			},
			select: {
				chatId: true
			}
		});
	
		const userChatIds = userChats.map((uc: any) => uc.chatId);
	
		// Then, get all chats that the user is a member of
		const chats = await this.databaseService.chat.findMany({
			where: {
				id: {
					in: userChatIds
				}
			}
		});
	
		return chats;
	}

	// Fetch all chats from the database
	async getAllChats(userId: string) {
		const chats = await this.databaseService.chat.findMany({
			include: {
				invited: true
			}
		});
		return chats;
	}

	// get a specific chat
	async getChat(chatId: string) {
		const chat = await this.databaseService.chat.findUnique({
		where: { id: chatId },
		include: {
			members: true,
			messages: true
		}
		});

		if (!chat) {
			return { error : 'Chat not found' };
		}

		return chat;
	}

	// Add a user to the channel
	async addMember(chatId: string, userId: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });
		const user = await this.databaseService.user.findUnique({ where: { id: userId } });

		if (!chat) return { error : 'Chat not found' };
		if (!user) return { error : 'User not found' };

		// Check if the user is already a member of the chat
		const existingMember = await this.databaseService.member.findFirst({
			where: {
				chatId: chatId,
				userId: userId
			}
		});

		if (existingMember) {
			return { alreadyMember : true };
		}

		// Check if the user is banned
    	if (chat.banned.includes(userId)) {
	        return { error : 'This user is banned from the chat.' };
    	}

		const newMember = await this.databaseService.member.create({
		data: {
			userId: userId,
			chatId: chatId,
			role: 'member'  // Default role when adding a new member
		}
		});

		// Add the newMember to the members array of the Chat
		await this.databaseService.chat.update({
			where: { id: chatId },
			data: {
			members: {
				connect: { id: newMember.id }
			}
			}
		});

		return newMember;
	}

	// Remove a user from the channel
	async deleteMember(chatId: string, userId: string) {
		const member = await this.databaseService.member.findFirst({
			where: {
				userId: userId,
				chatId: chatId
			}
		});

		if (!member) {
			return { error : 'Member not found in the chat' };
		}

		// Check the number of members in the chat
		const memberCount = await this.databaseService.member.count({
			where: {
				chatId: chatId
			}
		});

		// If this is the last member, delete the chat
		if (memberCount === 1) {
			return await this.deleteChat(chatId, userId)
		}

		if (member.role === 'creator') {
			// Find the oldest member that isn't the creator
			const oldestMember = await this.databaseService.member.findFirst({
				where: {
					chatId: chatId,
					NOT: {
						userId: userId
					}
				},
				orderBy: {
					id: 'asc'
				}
			});
		
			if (!oldestMember) {
				return { error : 'No other members found in the chat' };
			}
		
			// Update the oldest member's role to creator
			await this.databaseService.member.update({
				where: {
					id: oldestMember.id
				},
				data: {
					role: 'creator'
				}
			});
		}		

		// Else, just delete the member
		const deletedMember = await this.databaseService.member.delete({
			where: {
				id: member.id
			}
		});

		return deletedMember;
	}

	// Delete the chat
	async deleteChat(chatId: string, userId: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });
	
		if (!chat) return { error : 'Chat not found' };
	
		// Check user's role for the chat
		const member = await this.databaseService.member.findFirst({
			where: {
				chatId: chatId,
				userId: userId
			}
		});
	
		if (!member) return { error : 'User is not a member of this chat' };
	

		const memberCount = await this.databaseService.member.count({
			where: {
				chatId: chatId
			}
		});

		if (memberCount > 1 && member.role !== UserRole.creator) {
			return { error : 'Only the creator can delete the chat' };
		}

		await this.databaseService.member.deleteMany({
			where: {
				chatId: chatId
			}
		});

		await this.databaseService.message.deleteMany({
			where: {
				chatId: chatId
			}
		});
	
		await this.databaseService.invite.deleteMany({
			where: {
				chatId: chatId
			}
		});
	
		const deletedChat = await this.databaseService.chat.delete({
			where: {
				id: chatId
			}
		});
	
		return { message: 'Chat successfully deleted' };
	}

	// send message in chat
	async createMessage(chatId: string, userId: string, content: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });
		const user = await this.databaseService.user.findUnique({ where: { id: userId } });
	
		if (!chat) return { error : 'Chat not found' };
		if (!user) return { error : 'User not found' };
	
		const newMessage = await this.databaseService.message.create({
		data: {
			content: content,
			chatId: chatId,
			senderId: userId
		},
		include: {
			sender: true
		}
		});
	
		return newMessage;
	}

	// get all the messages of this chat from the most recent
	async getMessages(chatId: string) {
		return await this.databaseService.message.findMany({
			where: { chatId: chatId },
			orderBy: {
				createdAt: 'asc'
			},
			include: {
				sender: true
			}
		});
	}

	// Get all the members of the chat (for the setting UI)
	async getMembers(chatId: string) {
		const members = await this.databaseService.member.findMany({
		where: {
			chatId: chatId,
		},
		include: {
			user: true
		}
		});
	
		return members;
	}

	// change name of channel
	async updateChatName(chatId: string, newChatName: string, userId: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });

		if (!chat) return { error: 'Chat not found' };

		const checkAdmin = await this.isAdmin(chatId, userId);

		// Check if user is the creator or an admin
		if (!checkAdmin.ok) return { error: 'You are is not authorized to change the chat name' };

		const updatedChat = await this.databaseService.chat.update({
			where: { id: chatId },
			data: { name: newChatName }
		});

		return updatedChat;
	}

	// change password of channel
	async updateChatPassword(chatId: string, newPassword: string, userId: string) {
		const chat = await this.databaseService.chat.findUnique({ where: { id: chatId } });

		if (!chat) return { error: 'Chat not found' };

		const checkAdmin = await this.isAdmin(chatId, userId);

		// Check if user is the creator or an admin
		if (!checkAdmin.ok) return { error: 'You are not authorized to change the chat password' };

		// Check if the chat is of type 'protected'
		if (chat.type !== 'protected') return { error: 'Chat is not protected and cannot have a password' };

		const updatedChat = await this.databaseService.chat.update({
			where: { id: chatId },
			data: { password: newPassword }
		});

		return updatedChat;
	}


	// ban user from chat
	async banUserFromChat(chatId: string, adminUserId: string, targetUserId: string) {
		
		const getAdmin = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				id: true,
			}
		});

		if (!getAdmin)
			return { error : 'User is not a member of the chat' };

		// Check if adminUserId is either creator or admin
		const checkAdmin = await this.databaseService.member.findUnique({
			where: {
				id: getAdmin.id
			},
			select: {
				role: true
			}
		});
	
		if (!checkAdmin || (checkAdmin.role !== 'admin' && checkAdmin.role !== 'creator')) {
			return { error : 'Only admin or creator can ban users.' };
		}
	
		// Get the chat
		const chatToUpdate = await this.databaseService.chat.findUnique({
			where: {
				id: chatId
			}
		});
	
		if (!chatToUpdate) return { error : 'Chat not found' };
	
		// Remove target from the chat
		const user = await this.deleteMember(chatId, targetUserId);

		// Add user in the banned list
		const updatedChat = await this.databaseService.chat.update({
			where: {
				id: chatId
			},
			data: {
				banned: {
				push: targetUserId
				}
			}
		});
	
		return { data: updatedChat, ok: true };
	}

	async unbanUserFromChat(chatId: string, adminUserId: string, targetUserId: string) {
		// Ensure that the person making the request is either the creator or an admin
		const admin = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});
	
		if (!admin || (admin.role !== 'admin' && admin.role !== 'creator')) {
			return { error: 'Only admin or creator can ban users.' };
		}
	
		const chatToUpdate = await this.databaseService.chat.findUnique({
			where: {
				id: chatId
			}
		});
	
		if (!chatToUpdate) return { error: 'Chat not found' };
	
		// Check if user is banned
		if (!chatToUpdate.banned.includes(targetUserId)) {
			return { error: 'User is not banned.' };
		}

		// Remove the user from the banned array
		const updatedBannedList = chatToUpdate.banned.filter(userId => userId !== targetUserId);

		// Update the chat with the modified banned array
		const updatedChat = await this.databaseService.chat.update({
			where: {
				id: chatId
			},
			data: {
				banned: updatedBannedList
			}
		});

		return { data: updatedChat, ok: true};
	}

	// Kick user from chat
	async kickUserFromChat(chatId: string, adminUserId: string, targetUserId: string) {

		// Check if adminUserId is either creator or admin
		const checkAdmin = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});
	
		if (!checkAdmin || (checkAdmin.role !== 'admin' && checkAdmin.role !== 'creator')) {
			return { error : 'Only admin or creator can kick users.' };
		}
	

		const checkTarget = await this.databaseService.member.findFirst({
			where: {
				userId: targetUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});

		if (!checkTarget) {
			return { error : 'Target is not in this channel.'};
		}

		if (checkAdmin.role == 'admin' && (checkTarget.role == 'admin' || checkTarget.role == 'creator')) {
			return { error : 'Admin cannot kick other admin or creator.' };
		}

		return this.deleteMember(chatId, targetUserId);
	}

	// Invite user: add user to the invited list
	async inviteUserToChat(chatId: string, inviterUserId: string, targetUser: string) {

		// Check if targetUser is already a member of the chat
		const isMember = await this.databaseService.member.findFirst({
			where: {
				userId: targetUser,
				chatId: chatId
			}
		});
	
		if (isMember) {
			return { error : 'The target user is already a member of this chat.' }
		}
	
		// Check if the user is already invited
		const isInvited = await this.databaseService.invite.findFirst({
		where: {
			userId: targetUser,
			chatId: chatId
		}
		});
	
		if (isInvited) {
			return { error : 'The target user is already invited to this chat.' };
		}
	
		// Otherwise, add the user to the invite table
		const inviteRecord = await this.databaseService.invite.create({
		data: {
			userId: targetUser,
			chatId: chatId,
		}
		});
	
		return { data: inviteRecord, ok: true };
	}

	async uninviteUserFromChat(chatId: string, inviterUserId: string, targetUser: string) {
		// Check if the invite exists
		const invite = await this.databaseService.invite.findFirst({
			where: {
				userId: targetUser,
				chatId: chatId
			}
		});
	
		if (!invite) {
			return { error: 'The target user was not invited to this chat.' };
		}
	
		// Delete the invite
		const deletedInvite = await this.databaseService.invite.delete({
			where: {
				id: invite.id
			}
		});
	
		return { ok: true };
	}

	async muteMember(chatId: string, adminUserId: string, targetUserId: string, muteDuration: number) {

		// Check if adminUserId is either creator or admin
		const memberRole = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});

		if (!memberRole || (memberRole.role !== 'admin' && memberRole.role !== 'creator')) {
			return { error : 'Only admin or creator can mute users.' };
		}

		// Calculate mute end time
		const mutedUntil = new Date();
		mutedUntil.setMinutes(mutedUntil.getMinutes() + muteDuration);

		const targetMember = await this.databaseService.member.findFirst({
			where: {
				userId: targetUserId,
				chatId: chatId
			},
			select: {
				id: true
			}
		});
		
		if (!targetMember) {
			return { error : 'The target user is not a member of this chat.' };
		}

		// Mute the target member
		const mutedMember = await this.databaseService.member.update({
			where: {
				id: targetMember.id
			},
			data: {
				mutedUntil: mutedUntil
			}
		});

		return mutedMember;
	}

	async isMuted(chatId: string, userId: string) {
		const member = await this.databaseService.member.findFirst({
			where: {
				userId: userId,
				chatId: chatId
			},
			select: {
				mutedUntil: true
			}
		});
	  
		if (!member) {
			return { error : 'User is not a member of this chat.' };
		}
	  
		if (member.mutedUntil && member.mutedUntil > new Date()) {
			const now = new Date();
			const timeDiff = Math.abs(member.mutedUntil.getTime() - now.getTime());
			const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
			return { isMuted: true, remainingMinutes: diffMinutes };
		} else {
			return { isMuted: false };
		}
	}

	async unmuteMember(chatId: string, adminUserId: string, targetUserId: string) {

		// Check if adminUserId is either creator or admin
		const memberRole = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});
	  
		if (!memberRole || (memberRole.role !== 'admin' && memberRole.role !== 'creator')) {
		  	return { error : 'Only admin or creator can unmute users.' };
		}

		// Check if the target user is actually muted
		const targetMember = await this.databaseService.member.findFirst({
			where: {
				userId: targetUserId,
				chatId: chatId
			},
			select: {
				id: true,
				mutedUntil: true
			}
		});
	  
		if (!targetMember) {
		  	return { error : 'The target user is not a member of this chat.' };
		}
	  
		if (!targetMember.mutedUntil || targetMember.mutedUntil <= new Date()) {
		  	return { error : 'The target user is not muted.' };
		}
	  
		// Unmute the target member by setting the mutedUntil field to null
		const unmutedMember = await this.databaseService.member.update({
			where: {
				id: targetMember.id
			},
			data: {
				mutedUntil: null
			}
		});
	  
		return unmutedMember;
	}

	async setMemberAsAdmin(chatId: string, adminUserId: string, targetUserId: string) {
		// Check if adminUserId is either creator or admin
		const memberRole = await this.databaseService.member.findFirst({
			where: {
				userId: adminUserId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});

		if (!memberRole || (memberRole.role !== 'admin' && memberRole.role !== 'creator')) {
			return { status: 'Only admin or creator can set admins.' };
		}
	
		// Check if the target user is actually muted
		const targetMember = await this.databaseService.member.findFirst({
			where: {
				userId: targetUserId,
				chatId: chatId
			},
			select: {
				id: true,
				role: true
			}
		});

		if (!targetMember || targetMember.role === 'admin' || targetMember.role === 'creator') {
			return { status: 'Member is already an admin or creator, or not found.' };
		}
	
		await this.databaseService.member.update({
			where: { id: targetMember.id },
			data: { role: 'admin' }
		});
	
		return { status: 'Member has been set as admin successfully.' };
	}

	async getBannedUsers(chatId: string) {
		return await this.databaseService.chat.findUnique({
			where: {
				id: chatId,
			},
			select: {
				banned: true,
			},
		});
	}
	  
	async getInvitedUsers(chatId: string) {
		return await this.databaseService.invite.findMany({
			where: {
				chatId: chatId,
			},
			include: {
				user: true,
			},
		});
	}

	async isAdmin(chatId: string, userId: string) {
		const memberRole = await this.databaseService.member.findFirst({
			where: {
				userId: userId,
				chatId: chatId
			},
			select: {
				role: true
			}
		});

		if (!memberRole || (memberRole.role !== 'admin' && memberRole.role !== 'creator')) {
			return { ok: false };
		}

		return { ok: true };
	}
}