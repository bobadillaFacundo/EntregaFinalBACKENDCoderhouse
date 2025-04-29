![image](https://github.com/user-attachments/assets/2d37e27e-e2a1-45fd-bf51-e754cc124bca)


# 🛒 Gestión de Productos y Carritos

![Banner](banner.png)

Aplicación **e‑commerce API** desarrollada con **Node.js**, **Express** y **MongoDB** que permite la administración completa de productos y carritos de compra a través de endpoints REST y vistas en **Handlebars**.

---

## 🎥 Demo

En el siguiente video se puede observar el flujo completo de la aplicación:

[Ver video en Google Drive](https://drive.google.com/file/d/1jXGwxF_yMIH17aXVkjb0qcbvSdsqTPBG/view?usp=sharing)

El video muestra:

- Cargar Producto  
- Modificar Producto  
- Ordenar por _status_ y categoría  
- Buscar producto  
- Eliminar producto  
- Uso de paginación  
- Creación automática de carrito al intentar cargar un producto si no existe  
- Crear carrito  
- Cargar carrito  
- Buscar carrito y uso de **populate**  
- Eliminar carrito  
- Eliminar producto de carrito  

---

## 🧰 Tecnologías

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | HTML · CSS · JavaScript · Handlebars |
| **Backend**  | Node.js · Express |
| **Base de datos** | MongoDB (persistencia) |
| **Contenedores** | Docker · Docker‑Compose |

---

## ⚙️ Preparación de la aplicación

1. **Clonar** este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/bobadillaFacundo/GestionProductosYCarritos.git
   cd GestionProductosYCarritos
   ```

2. **Variables de entorno**  
   Copia el archivo `.env.example` y renómbralo a `.env`, luego rellena los valores correspondientes:
   ```bash
   cp .env.example .env
   # editar .env según tu configuración
   ```

---

## 🐳 Construcción y ejecución con Docker

Asegúrate de tener **Docker** y **Docker‑Compose** instalados.
   
1. Construir la imagen:
   ```bash
   docker-compose build
   ```

2. Levantar los servicios:
   ```bash
   docker-compose up
   ```

3. Abre tu navegador en  
   <http://localhost:8080/api/products/principal>

Los datos se persisten automáticamente en la base de datos **MongoDB** definida en `docker-compose.yml`.

---

## 📬 Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Listar productos (paginación, filtros) |
| GET | `/api/products/:pid` | Obtener producto por ID |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:pid` | Modificar producto |
| DELETE | `/api/products/:pid` | Eliminar producto |
| GET | `/api/carts/:cid` | Obtener carrito |
| POST | `/api/carts` | Crear carrito |
| POST | `/api/carts/:cid/product/:pid` | Agregar producto al carrito |
| DELETE | `/api/carts/:cid` | Eliminar carrito |
| DELETE | `/api/carts/:cid/product/:pid` | Eliminar producto del carrito |

(*Consulta la documentación Swagger para detalles y parámetros.*)

---

## 👨‍💻 Autor

[Facundo Bobadilla](https://github.com/bobadillaFacundo)

¡Los issues, forks y estrellas ⭐ son bienvenidos!





