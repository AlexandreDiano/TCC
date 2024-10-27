FROM node:12.20-alpine
WORKDIR /myapp/frontend
COPY package.json /myapp/frontend/
RUN npm install -g serve
RUN npm install
COPY . /myapp/frontend/
EXPOSE 5000
CMD ["export", "NODE_OPTIONS=--openssl-legacy-provider"]
CMD ["yarn", "start:old"]
#CMD ["serve", "-s", "build"]
