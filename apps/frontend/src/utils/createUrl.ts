
// return the url of the backend server (depending on the environment)
const createUrl = (path?: string) => {
  const baseUrl = typeof window === "undefined" // SSR internal docker network
    ? process.env.SERVER_BACKEND_URL
    : process.env.NEXT_PUBLIC_CLIENT_BACKEND_URL
  if (!baseUrl) {
    throw new Error('baseUrl is not defined, something is wrong with the environment variables.')
  }
  if (!path) {
    return baseUrl
  }
  return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`
}

export const createAvatarUrl = (path?: string) => {
return path ? (path.includes('https://') ? `url(${path})` : `url(${createUrl(path)})` ) : `url(${createUrl('public/default.png')})`
}

export default createUrl