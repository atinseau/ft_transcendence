#!/bin/bash

MONOREPO_ROOT="$(dirname -- "${BASH_SOURCE[0]}")"            # relative
MONOREPO_ROOT="$(cd -- "$MY_PATH" && pwd)"    # absolutized and normalized
MONOREPO_ROOT="$(echo $MONOREPO_ROOT | sed 's/\/scripts//g')"

cd $MONOREPO_ROOT

# Clean all packages

function clean_build() {
  echo "Cleaning build..."
  rm -rf $MONOREPO_ROOT/apps/frontend/.next
  rm -rf $MONOREPO_ROOT/apps/backend/dist
}

function clean_turbo() {
  echo "Cleaning turbo..."
  rm -rf $MONOREPO_ROOT/apps/*/.turbo
}

function clean_deps() {
  echo "Cleaning dependencies..."
  rm -rf $MONOREPO_ROOT/apps/*/node_modules
  rm -rf $MONOREPO_ROOT/node_modules
  rm -rf $MONOREPO_ROOT/pnpm-lock.yaml
}

function clean_docker() {
  echo "Cleaning docker..."
  docker-compose down
  docker network rm $(docker network ls -q)
  docker image rm $(docker image ls -aq)
  docker volume rm $(docker volume ls --format '{{.Name}}')
}

# Get all arguments
for kwarg in "$@"; do

  if [[ "$kwarg" == "--docker" ]]; then
    clean_docker
    exit 0
  fi

  if [[ "$kwarg" == "--build" ]]; then
    clean_build
    exit 0
  fi

  if [[ "$kwarg" == "--turbo" ]]; then
    clean_turbo
    exit 0
  fi

  if [[ "$kwarg" == "--deps" ]]; then
    clean_deps
    exit 0
  fi

  if [[ "$kwarg" == "--all" ]]; then
    clean_turbo
    clean_deps
    exit 0
  fi

  echo "Unknown argument: $kwarg"
  exit 1
done

echo "No arguments provided"