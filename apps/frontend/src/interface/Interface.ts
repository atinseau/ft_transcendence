export enum UserStatus {
	online = "online",
	offline = "offline",
	ingame = "ingame",
}
  
export enum ChatType {
	public = "public",
	private = "private",
	protected = "protected",
}
  
export enum UserRole {
	creator = "creator",
	admin = "admin",
	member = "member",
}
  
  
export interface User {
	id: string;
	username: string;
	email: string;
	password?: string | null;
	createdAt: Date;
	updatedAt: Date;
	refreshTokens: RefreshToken[];
	initiatedFriendships: Friendship[];
	acceptedFriendships: Friendship[];
	blockedFriends: string[];
	friendMessages: FriendMessage[];
	chats: Member[];
	messages: Message[];
	invited: Invite[];
	status: UserStatus;
	wins: number,
	losses: number,
	points: number,
	gamesAsPlayer1: Game[];
	gamesAsPlayer2: Game[];
	avatar: string,
	flag_avatar: boolean
}

export interface Game {
	id: string;
	player1: User,
	player2: User,
	player1Id: string;
	player2Id: string;
	player1Score: number;
	player2Score: number;
	createdAt: Date;
}
  
export interface RefreshToken {
	id: string;
	userId: string;
	hashedToken: string;
	revoked: boolean;
	User: User;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
}
  
export interface Chat {
	id: string;
	name: string;
	type: ChatType;
	password?: string | null;
	members: Member[];
	messages: Message[];
	banned: string[];
	invited: Invite[];
	createdAt: Date;
	updatedAt: Date;
}
  
export interface Member {
	id: string;
	userId: string;
	user: User;
	chatId: string;
	chat: Chat;
	role: UserRole;
	mutedUntil?: Date | null;
}
  
export interface Message {
	id: string;
	content: string;
	createdAt: Date;
	senderId: string;
	sender: User;
	chatId: string;
	chat: Chat;
}
  
export interface Invite {
	id: string;
	userId: string;
	user: User;
	chatId: string;
	chat: Chat;
	createdAt: Date;
}
  
export interface FriendMessage {
	id: string;
	content: string;
	createdAt: Date;
	senderId: string;
	sender: User;
	friendshipId: string;
	friendship: Friendship;
}
  
export interface Friendship {
	id: string;
	user1Id: string;
	user1: User;
	user2Id: string;
	user2: User;
	messages: FriendMessage[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Request {
    id: string;
    requester: User;
    requestee: User;
    createdAt: Date;
}