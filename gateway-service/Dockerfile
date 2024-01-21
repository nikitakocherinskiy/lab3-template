FROM node:18
WORKDIR /app/gateway-service
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install -g @nestjs/cli
RUN npm ci
RUN ls -al
COPY . .
EXPOSE 8080
CMD [  "npm", "run", "start:dev" ]