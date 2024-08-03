import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname

// Función para obtener todos los documentos de una colección
export async function obtenerTodosLosDocumentos(model) {
  try {
    const documents = await model.find()
    return documents
  } catch (error) {
   return {message:'Error al conectar o interactuar con la base de datos en obtenerTodoslosDocumentos', error}
  } 
}

// Función para obtener un documento de una colección
export async function obtenerDocumento(id,Model) {
  try {
    const document = await Model.findById(id)
    return document
  } catch (error) {
    return { message:'Error al conectar o interactuar con la base de datos en obtenerDocumento', error}
  }
}

export async function deleteDocumento(id,Model) {
  try {const document = await Model.deleteOne({ _id: id })
    return document
  } catch (error) {
    return {message:'Error al conectar o interactuar con la base de datos en deleteDocumento', error}
  } 
}

export function ERROR(res,message,status){
  status = status ?? 404
  res.status(status).render('ERROR', {
      style: 'index.css',
      status,
      resultado: message
  })
}
