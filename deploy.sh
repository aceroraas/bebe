#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con formato
print_step() {
    echo -e "${BLUE}==>${NC} ${GREEN}$1${NC}"
}

# Verificar que las variables de entorno estén configuradas
print_step "Verificando variables de entorno..."
ENV_VARS=(
    "VITE_FIREBASE_API_KEY"
    "VITE_FIREBASE_AUTH_DOMAIN"
    "VITE_FIREBASE_PROJECT_ID"
    "VITE_FIREBASE_STORAGE_BUCKET"
    "VITE_FIREBASE_MESSAGING_SENDER_ID"
    "VITE_FIREBASE_APP_ID"
)

for var in "${ENV_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: La variable $var no está configurada"
        exit 1
    fi
done

# Instalar dependencias
print_step "Instalando dependencias..."
npm install

# Construir el proyecto
print_step "Construyendo el proyecto..."
npm run build

# Verificar que la carpeta dist existe
if [ ! -d "dist" ]; then
    echo "Error: La carpeta dist no se creó correctamente"
    exit 1
fi

# Desplegar a Firebase
print_step "Desplegando a Firebase..."
firebase deploy --only hosting

print_step "¡Despliegue completado!"
