# Build from the repository root: docker build -f backend/Dockerfile .
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4000 REGISTRY_DIR=/app/config/registry
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node packages/core ./packages/core
COPY --chown=node:node backend ./backend
COPY --chown=node:node config/registry ./config/registry
COPY --chown=node:node config/markets ./config/markets
COPY --chown=node:node pages ./pages
RUN npm ci --omit=dev --workspace=backend --include-workspace-root=false 2>/dev/null || npm ci --omit=dev
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:4000/healthz').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "backend/src/index.mjs"]
