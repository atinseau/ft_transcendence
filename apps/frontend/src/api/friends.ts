import { createUrl } from "@utils";
import socket from "../utils/socket";
const BASE_URL = createUrl()  // adjust the default URL accordingly

// Return user's friend list or empty array
export async function getFriends(userId: string) {
    const response = await fetch(`${BASE_URL}/friends/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    });

    return response.json();
};

// Return updated user
export async function addFriend(userId: string, friendId: string) {
    const response = await fetch(`${BASE_URL}/friends/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, friendId })
    });

    return response.json();
};

export async function getUserByUsername(username: string | string[] | undefined) {
    const response = await fetch(`${BASE_URL}/friends/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
    });
    return response.json();
}

// Return all users
export async function getUsers() {
    const response = await fetch(`${BASE_URL}/friends/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

// Return updated user
export async function deleteFriend(userId: string, friendId: string) {
    const response = await fetch(`${BASE_URL}/friends/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, friendId })
    });

    return response.json();
};

// Return a response after sending a message
export async function sendFriendMessage(friendshipId: string | undefined, senderId: string, content: string) {
    if (friendshipId == undefined) return;

    socket.emit('sendFriendMessage', {
        friendshipId,
        senderId,
        content,
    });
}

// Return a list of messages within a specific friendship
export async function getFriendshipMessages(friendshipId: string) {
    const response = await fetch(`${BASE_URL}/friends/messages/${friendshipId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.json();
};

// Return updated user
export async function blockUser(userId: string, blockedId: string) {
    const response = await fetch(`${BASE_URL}/friends/block`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, blockedId })
    });

    return response.json();
};

// Return updated user
export async function unblockUser(userId: string, blockedId: string) {
    const response = await fetch(`${BASE_URL}/friends/unblock`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, blockedId })
    });

    return response.json();
};

// Return list of blocked users for a user
export async function getBlockedUsers(userId: string) {
    const response = await fetch(`${BASE_URL}/friends/blocked-users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.json();
};

// Return friendship ID using the usernames of the current user and friend user
export async function getFriendship(currentUserId: string, friendUserId: string) {
    const response = await fetch(`${BASE_URL}/friends/friendship?currentUserId=${currentUserId}&friendUserId=${friendUserId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

export async function checkIfFriendshipExists(friendshipId: string) {
    const response = await fetch(`${BASE_URL}/friends/${friendshipId}/exist`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
}

// Function to accept a friend request
export async function acceptFriendRequest(userId: string, friendRequestId: string) {
    const response = await fetch(`${BASE_URL}/friends/friend-requests/accept`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, friendRequestId })
    });

    return response.json();
};

// Function to refuse a friend request
export async function declineFriendRequest(userId: string, friendRequestId: string) {
    const response = await fetch(`${BASE_URL}/friends/friend-requests/decline`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, friendRequestId })
    });

    return response.json();
};

// Function to fetch pending friend requests
export async function fetchFriendRequests(userId: string) {
    const response = await fetch(`${BASE_URL}/friends/friend-requests/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

// Function to check if two users are friends
export async function areTheyFriends(userId1: string, userId2: string) {
    const response = await fetch(`${BASE_URL}/friends/are-friends?userId1=${userId1}&userId2=${userId2}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.json();
};