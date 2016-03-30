FROM node:5.9

ADD . /var/app

WORKDIR /var/app

RUN npm install

CMD npm start
