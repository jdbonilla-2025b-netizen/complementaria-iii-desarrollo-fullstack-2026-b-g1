# ---------- Etapa 1: compilar la app de React ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Vite "incrusta" VITE_API_URL en el JavaScript al compilar, por eso
# llega como argumento de construcción y no como variable en ejecución.
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- Etapa 2: servir los archivos estáticos con Nginx ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
