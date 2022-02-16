FROM node:14.18.1-alpine AS dev
WORKDIR usr/src/app
COPY package*.json ./
RUN npm install --only=development
COPY . .
