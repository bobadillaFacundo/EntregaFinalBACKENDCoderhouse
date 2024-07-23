import path from "path"
import { fileURLToPath } from "url"
import mongo from 'mongoose'
import porductsModel from "./models/products.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname

// Función para obtener todos los documentos de una colección
export async function obtenerTodosLosDocumentos(url,model) {
  try {
    await mongo.connect(url); // Conexión a la base de datos
    console.log('Conectado correctamente al servidor de MongoDB obtenerTodosLosDocumentos');
    // Consulta para obtener todos los documentos de la colección
    const documents = await model.find()
    return documents
  } catch (error) {
    console.error('Error al conectar o interactuar con la base de datos en obtenerTodoslosDocumentos', error);

  } finally {
    await mongo.connection.close(); // Cerrar la conexión cuando termine
    console.log('Conexión cerrada correctamente en obtenerTodoslosDocumentos');
  }
}

// Función para obtener un documento de una colección
export async function obtenerDocumento(id, url, Model) {
  try {
    await mongo.connect(url)
    console.log('Conectado correctamente al servidor de MongoDB obtenerDocumento');
    // Consulta para obtener todos los documentos de la colección
    const document = await Model.findById(id)
    return document
  } catch (error) {
    console.error('Error al conectar o interactuar con la base de datos en obtenerDocumento', error);
  } finally {
    await mongo.connection.close(); // Cerrar la conexión cuando termine
    console.log('Conexión cerrada correctamente en obtenerDocumento');
  }
}

export async function deleteDocumento(id, url, Model) {
  try {
    await mongo.connect(url)
    console.log('Conectado correctamente al servidor de MongoDB obtenerDocumento');
    // Consulta para obtener todos los documentos de la colección
    const document = await Model.deleteOne({ _id: id })
    return document
  } catch (error) {
    console.error('Error al conectar o interactuar con la base de datos en obtenerDocumento', error);
  } finally {
    await mongo.connection.close(); // Cerrar la conexión cuando termine
    console.log('Conexión cerrada correctamente en obtenerDocumento');
  }
}
