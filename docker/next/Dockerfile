FROM ft_transcendance_base

RUN mkdir -p /app
WORKDIR /app

COPY . /app/
COPY docker/next/start.sh /app/start.sh

# only for clean up, this image is only for frontend
RUN rm -rf /app/apps/backend

RUN chmod +x /app/start.sh

# Prevents "cross-device link not permitted" error from pnpm when using volumes
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install

CMD ["bash", "/app/start.sh"]