FROM node:14.18.1-alpine AS dev
WORKDIR usr/src/app
COPY package*.json ./
RUN apk add --update --no-cache --virtual builds-deps build-base python3 && ln -sf python3 /usr/bin/python
RUN yarn install
RUN pip3 install Flask
RUN pip3 install underthesea
CMD yarn start:prod
CMD python3 AI/bkservice.py
COPY . .
