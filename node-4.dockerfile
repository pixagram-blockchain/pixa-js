FROM node:4
ADD ./package.json /pixajs/package.json
WORKDIR /pixajs
RUN npm install
ADD . /pixajs
RUN npm test
