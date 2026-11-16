# ---------- Etapa 1: dependencias de producción ----------
FROM node:22-alpine AS deps
WORKDIR /app
# Copiamos primero solo los manifiestos para aprovechar la caché de capas:
# si el código cambia pero package.json no, npm ci no se vuelve a ejecutar.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---------- Etapa 2: imagen final ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

# No ejecutar como root dentro del contenedor.
USER node

EXPOSE 3000

# Docker marca el contenedor como "unhealthy" si /health deja de responder.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
