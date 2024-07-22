# Usa una imagen base de Node.js
FROM node:19

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /
# Copia el package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto 3000
EXPOSE 8080

# Variables de entorno para MongoDB
ENV MONGO_URL='mongodb://localhost:27017'
ENV MONGO_DB='coderhouse'
ENV MONGO_COLLECTION_PRODUCTS='products'
ENV MONGO_COLLECTION_CARTS='carts'
ENV MONGO_DB_URL='mongodb://localhost:27017/coderhouse'


# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]