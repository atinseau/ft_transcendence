#!/bin/bash

RED="\e[31m"
GREEN="\e[32m"
RESET="\e[0m"
YELLOW='\e[1;33m'

MONOREPO_ROOT="$(dirname -- "${BASH_SOURCE[0]}")"            # relative
MONOREPO_ROOT="$(cd -- "$MY_PATH" && pwd)"    # absolutized and normalized
MONOREPO_ROOT="$(echo $MONOREPO_ROOT | sed 's/\/scripts//g')"

cd $MONOREPO_ROOT

if [ ! -f ".env.development" ]; then
  printf "${RED}Please create .env.development file${RESET}\n"
  exit 1
fi

# it will only start postgres and adminer with a custom env file by docker-compose merging feature
docker-compose \
  -f docker-compose.yml \
  -f docker/docker-compose.dev.yml \
  up -d \
  postgres adminer

if [[ "$1" == "--only-db" ]]; then
  exit 0
fi

# Start dev task with .env.development file
dotenv -e .env.development turbo run dev 