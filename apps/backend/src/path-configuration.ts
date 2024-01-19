import { join } from "path";

export const _DESTINATION = process.env.ENVIRONMENT === "production" ? "/public" : join(__dirname, "/public").replace('dist', 'src');

