FROM node:16

WORKDIR /app

COPY . .

RUN npm install -g expo-cli && npm install --legacy-peer-deps

EXPOSE 19000 19001 19002

CMD ["expo", "start", "--tunnel"]
