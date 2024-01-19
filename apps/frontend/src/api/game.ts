import { createUrl } from "@utils";
const BASE_URL = createUrl();  // adjust the default URL accordingly

// Create a new game
export async function createGame(player1Id: string, player2Id: string) {
	const response = await fetch(`${BASE_URL}/game/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ player1Id, player2Id })
	});

	return response.json();
}

// Update user wins
export async function updateUserWins(userId: string) {
	const response = await fetch(`${BASE_URL}/game/wins`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId })
	});

	return response.json();
}

// Update user losses
export async function updateUserLosses(userId: string) {
	const response = await fetch(`${BASE_URL}/game/losses`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId })
	});

	return response.json();
}

// Update user points
export async function updateUserPoints(userId: string, points: number) {
	const response = await fetch(`${BASE_URL}/game/points`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ userId, points })
	});

	return response.json();
}

// Update game score
export async function updateGameScore(gameId: string, playerWhoScoredId: string) {
	const response = await fetch(`${BASE_URL}/game/${gameId}/score`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ playerWhoScoredId })
	});

	return response.json();
}

export async function getUserAndGamesByUsername(username: string | string[] | undefined) {
    const response = await fetch(`${BASE_URL}/game/user-games`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
    });

    return response.json();
}