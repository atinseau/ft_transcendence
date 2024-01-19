FROM ft_transcendance_base

RUN mkdir -p /app
WORKDIR /app

COPY . /app/
COPY docker/nest/start.sh /app/start.sh
# the avatar storage folder needs to be created if not already present
COPY apps/backend/src/public/default.png /public/default.png

# only for clean up, this image is only for backend
RUN rm -rf /app/apps/frontend

RUN chmod +x /app/start.sh

# Prevents "cross-device link not permitted" error from pnpm when using volumes
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install


CMD ["bash", "/app/start.sh"]