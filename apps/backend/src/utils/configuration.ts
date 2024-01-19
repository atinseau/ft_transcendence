
export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_PORT: process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT): null,
});