FROM node:12.13.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install

COPY . .

#RUN npm run build
EXPOSE 4200
#RUN cd dist/med-broker-ui
CMD [ "npm", "start" ]
