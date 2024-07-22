import path from "path"
import { fileURLToPath } from "url"
import mongo from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname



// Definir un esquema
export const productSchema = new mongo.Schema({
  title: String,
  description: String,
  code: Number,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [], 
});





// Función para conectar a la base de datos y ejecutar operaciones
export async function insertarUnElemento(messages,url,bdb,collectio) {
    try {
      const client = mongo
      // Conectar al servidor MongoDB
      await client.connect(url);
      console.log('Conectado correctamente al servidor de MongoDB inertarUnElemento');
      const collection = client.Collection(collectio)
      await collection.insertOne(messages);
    } catch (error) {
      console.error('Error al conectar o interactuar con la base de datos inertarUnElemento:', error);
    } finally {
      await client.close(); // Cerrar la conexión cuando termine
      console.log('Conexión cerrada correctamente en inertarUnElemento');
    }
  }
  
  // Función para obtener todos los documentos de una colección
export  async function obtenerTodosLosDocumentos(url,bdb,collectio) {
    try {
      const client = mongo
      await client.connect(url); // Conexión a la base de datos
      console.log('Conectado correctamente al servidor de MongoDB obtenerTodosLosDocumentos');
      const collection = client.Collection(collectio)
      // Consulta para obtener todos los documentos de la colección
      const documents = await collection.find({}).toArray()
      return documents
    } catch (error) {
      console.error('Error al conectar o interactuar con la base de datos en obtenerTodoslosDocumentos', error);
  
    } finally {
      await client.close(); // Cerrar la conexión cuando termine
      console.log('Conexión cerrada correctamente en obtenerTodoslosDocumentos');
    }
  }

    // Función para obtener un documento de una colección
export  async function obtenerDocumento(id,url,bdb,collectio) {
  try {
    const client = mongo
    await client.connect(url); // Conexión a la base de datos
    console.log('Conectado correctamente al servidor de MongoDB obtenerDocumento');
    const collection = client.Collection(collectio)
    // Consulta para obtener todos los documentos de la colección
    let document = await collection.find({}).toArray()
    document = document.find(a => a._id!==id)
    return document
  } catch (error) {
    console.error('Error al conectar o interactuar con la base de datos en obtenerDocumento', error);

  } finally {
    await client.close(); // Cerrar la conexión cuando termine
    console.log('Conexión cerrada correctamente en obtenerDocumento');
  }
}

export  async function deleteDocumento(id,url,bdb,collectio) {
  try {
    const client = mongo
    await client.connect(url); // Conexión a la base de datos
    console.log('Conectado correctamente al servidor de MongoDB obtenerDocumento');
    const collection = client.Collection(collectio)
    // Convertir el id a ObjectId
    const ob = new ObjectId(id);
    // Consulta para eliminar documento de la colección
    return await collection.deleteOne({_id:mongo.Types.ObjectId(id)})
  } catch (error) {
    console.error('Error al conectar o interactuar con la base de datos en obtenerDocumento', error);

  } finally {
    await client.close(); // Cerrar la conexión cuando termine
    console.log('Conexión cerrada correctamente en obtenerDocumento');
  }
}
