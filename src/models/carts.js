import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const cartsCollection = "carts"
const cartsSchema = mongoose.Schema({
  products: [
    {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        cantidad: { type: Number, default: 1 }
    }
]
})

cartsSchema.plugin(mongoosePaginate)
const cartsModel = mongoose.model(cartsCollection,cartsSchema)
export default cartsModel