FROM node

RUN mkdir /src
add . /src
WORKDIR /src
RUN npm install

EXPOSE 8080

CMD npm start