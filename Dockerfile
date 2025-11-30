# # 1. app builder
# FROM node:18-alpine AS build
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build --prod

# # 2. Serveur Nginx
# FROM nginx:alpine
# COPY --from=build /app/dist/PMT_front_code/ /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]



# FROM node:18-alpine
# WORKDIR /app
# COPY . .
# RUN npm install
# EXPOSE 4200
# CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

# 1. Build de l'app Angular
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# 2. Serveur Nginx
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/pmt-front-code/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

