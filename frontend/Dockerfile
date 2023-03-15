FROM alpine
RUN apk add --update nodejs npm
COPY .  /usr/src/app/frontend/
WORKDIR /usr/src/app/frontend/
RUN npm install
CMD [ "npm", "start" ]