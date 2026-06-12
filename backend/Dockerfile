FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
# 改用我們剛設定好的 dev 指令，讓它支援 ts-node-dev 的熱重載
CMD ["npm", "run", "dev"]