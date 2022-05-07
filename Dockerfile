FROM node:14.18.1-alpine AS dev
WORKDIR usr/src/app
COPY package*.json ./
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache --virtual builds-deps build-base python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN yarn install
CMD yarn start:prod
COPY . .
