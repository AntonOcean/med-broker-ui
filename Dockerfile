FROM node:alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install

COPY . .

RUN npm run build --prod --no-progress
EXPOSE 4200
RUN cd dist/med-broker-ui

CMD [ "npm", "start" ]


#FROM nginx:alpine
#
#RUN rm -rf /usr/share/nginx/html/*
#
#COPY --from=builder /usr/src/app/dist/med-broker-ui /usr/share/nginx/html
#
#COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
#
#EXPOSE 80
