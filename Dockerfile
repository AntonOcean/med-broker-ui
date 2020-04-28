#FROM node:alpine AS builder
#
#WORKDIR /usr/src/app
#
#COPY package*.json ./
#
#RUN apk update && apk upgrade && \
#    apk add --no-cache bash git openssh
#
#RUN npm install
#
#COPY . .
#
#RUN npm run build --prod --no-progress
#EXPOSE 4200
#RUN cd dist/med-broker-ui
#
#CMD [ "npm", "start" ]


#FROM nginx:alpine
#
#RUN rm -rf /usr/share/nginx/html/*
#
#COPY --from=builder /usr/src/app/dist/med-broker-ui /usr/share/nginx/html
#
#COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
#
#EXPOSE 80


# Первый базовый образ для сборки
FROM alexxxnf/spa-builder as builder

RUN apk add --update \
  python \
  python-dev \
  py-pip \
  build-base \
  git \
  openssh-client \
&& pip install virtualenv \
&& rm -rf /var/cache/apk/*

# Чтобы эффктивнее использовать кэш Docker-а, сначала устанавливаем только зависимости
COPY ./package.json ./package-lock.json /app/
RUN cd /app && npm ci --no-audit
# Потом собираем само приложение
COPY . /app
RUN cd /app && npm run build --prod --configuration=docker

# Второй базовый образ для раздачи
FROM nginx-spa
# Забираем из первого образа сначала компрессор
COPY --from=builder /usr/local/bin/brotli /usr/local/bin
# Потом добавляем чудо-скрипт
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
# И в конце забираем само приложение
COPY --from=builder /app/dist/med-broker-ui /etc/nginx/html/
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
