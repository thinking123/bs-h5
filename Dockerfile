FROM node:8.15.0-jessie-slim as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15.8-alpine
WORKDIR /html
COPY --from=builder /app/dist/ .
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]
