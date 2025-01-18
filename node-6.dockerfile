FROM node:6
ADD ./package.json /pixajs/package.json
WORKDIR /pixajs
RUN npm install
ADD . /pixajs
RUN npm test
