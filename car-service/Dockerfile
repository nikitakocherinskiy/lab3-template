FROM node:18
WORKDIR /app/car-service
COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./
RUN npm ci
RUN npx prisma generate
RUN ls -al
COPY . .
EXPOSE 8070
CMD [  "npm", "run", "start:dev" ]