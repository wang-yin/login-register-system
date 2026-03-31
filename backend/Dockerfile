FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 你的 Express 跑在 5000
EXPOSE 5000

CMD ["npm", "run", "dev"]