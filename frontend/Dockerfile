FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# 根據你選的框架決定啟動指令 (Next.js 用 npm run dev, Vite 用 npm run dev -- --host)
CMD ["npm", "run", "dev"]