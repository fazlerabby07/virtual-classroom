FROM node:10-alpine

LABEL MAINTAINER Muhammad Hussain
LABEL EMAIL fazlerabby07@gmail.com
LABEL VERSION 1.0

WORKDIR /opt/app

RUN apk update
RUN npm install nodemon -g

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

