# Usa una imagen oficial de Node.js
FROM node:18

# Crea el directorio de la app
WORKDIR /app

# Copia package files y los instala
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia el resto del código y compila
COPY . .
RUN npm run build

# Expone el puerto que usas en NestJS (por defecto 3000)
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "run", "start:prod"]