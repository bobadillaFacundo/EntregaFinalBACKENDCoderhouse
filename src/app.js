import carts from "./routers/carts.router.js"
import products from "./routers/products.router.js"
import express from "express"
import engine from "express-handlebars"
import __dirname from './utils.js'
import path from "path"
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Configura Express para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para analizar el cuerpo de la solicitud
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de rutas
app.use('/api/products', products);
app.use('/api/carts', carts);

// Configuración del motor de vistas
app.engine('handlebars', engine.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Permite acceso a propiedades heredadas
        allowProtoMethodsByDefault: true,    // Permite acceso a métodos heredados
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de tipo MIME para CSS (si es necesario)
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), {
    setHeaders: (res, filePath) => {
        const contentType = mime.getType(filePath) || 'text/plain';
        res.setHeader('Content-Type', contentType);
    }
}));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error de conexión a MongoDB:', err);
});

// Iniciar servidor
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});