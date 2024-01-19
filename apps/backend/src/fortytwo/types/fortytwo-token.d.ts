

type FortyTwoToken = {
  access_token: string,
  token_type: 'bearer',
  expires_in: number, // in seconds
  refresh_token: string,
  scope: 'public',
  created_at: number,
  secret_valid_until: number
}