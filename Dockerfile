FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm build
EXPOSE 4200
RUN cd dist/med-broker-ui
CMD [ "npm", "start" ]
