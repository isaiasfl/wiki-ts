# Imagen para servir la wiki en la red del aula (por ejemplo, durante un examen).
#   docker build -t wiki-ts .
#   docker run -d --name wiki-ts -p 8080:80 --restart unless-stopped wiki-ts
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV WIKI_NO_GIT=1
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
