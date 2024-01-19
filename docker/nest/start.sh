# build backend and ignore scripts build command
pnpm prisma migrate deploy
pnpm prisma generate

./node_modules/turbo/bin/turbo build
pnpm --filter @ft/backend run start