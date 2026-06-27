# Etapa 1: Compilación de la aplicación
FROM node:22-alpine as build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y compilar (esto minifica y ofusca el código)
COPY . .
RUN npm run build

# Etapa 2: Servidor web con Nginx
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados de la etapa anterior
# (Asegúrate de cambiar "ui.fase2" por el nombre exacto de la carpeta que genera Angular dentro de dist/)
COPY --from=build /app/dist/ui.fase2/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
