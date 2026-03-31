# 使用 Node 輕量版本
FROM node:20-alpine

WORKDIR /app

# 先複製 package.json 以利用快取
COPY package*.json ./
RUN npm install

# 複製其餘程式碼
COPY . .

# Next.js 開發模式通常跑在 3000
EXPOSE 3000

CMD ["npm", "run", "dev"]