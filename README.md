# 🛒 eCommerce API

API RESTful para un sistema de comercio electrónico, desarrollada con **NestJS** y preparada para despliegue continuo con **Docker** y **GitHub Actions**. Esta API incluye integración con **Mercado Pago** para pagos, así como testing automatizado.

---

## Características principales

- 🔧 Arquitectura modular con **NestJS**
- 🧪 Pruebas **unitarias** para múltiples módulos
- 💳 Integración completa con **Mercado Pago**
- 🐳 Contenedores listos con **Docker y Docker Compose**
- 🔁 CI/CD con **GitHub Actions**
- 📦 Gestión de dependencias con `npm`
- 🧼 Linting y formateo con **ESLint** y **Prettier**
- 💾 Cacheo de resultados con **Redis**

---

## ⚙️ Tecnologías

- **Node.js**
- **Redis**
- **NestJS**
- **TypeScript**
- **Mercado Pago SDK**
- **Jest** (para pruebas)
- **Docker / Docker Compose**
- **GitHub Actions**
- **ESLint + Prettier**

---

## 🧪 Testing

La API cuenta con pruebas unitarias para los módulos principales, utilizando `Jest`. Puedes ejecutar las pruebas localmente con:

```bash
npm run test
```

---

## 💳 Integración con Mercado Pago

- Creación de pagos desde la API
- Webhooks para notificaciones de eventos (como pagos exitosos)
- Validación de transacciones
- Soporte para múltiples métodos de pago

> Asegúrate de configurar tus credenciales de Mercado Pago (`access_token`) en las variables de entorno o dentro del `docker-compose.yml`.

---

## 🐳 Uso con Docker

Puedes levantar todo el entorno de desarrollo con Docker ejecutando:

```bash
docker-compose up --build
```

---

## 🚀 Deployment

puedes revisar la documentacion de los endpoints desplegados [aqui](https://e-commerce-qoi7.onrender.com/api#/)

<img width="951" alt="image" src="https://github.com/user-attachments/assets/8d8dd5b6-10db-4001-afde-456da220e028" />


---

## 🛠 Scripts útiles

```bash
# Iniciar el servidor en modo desarrollo
npm run start:dev

# Ejecutar el servidor en modo producción
npm run start:prod

# Compilar el proyecto
npm run build

# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas en modo watch (útil para desarrollo)
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar linter
npm run lint

# Aplicar formato con Prettier
npm run format
```
---
# modelo de base de datos 
<img width="920" alt="Screenshot 2025-04-24 at 10 26 43 PM" src="https://github.com/user-attachments/assets/22a76e5d-feb2-435c-8434-c749b89d769f" />


