import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const productsCollection = "products"
const productsSchema = mongoose.Schema({
  title: String,
  description: String,
  code: Number,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: []
})

productsSchema.plugin(mongoosePaginate);
const porductsModel = mongoose.model(productsCollection, productsSchema)
export default porductsModel