const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  cart_token: String,
  creation_date: Date,
  last_update_date: Date,
  ecommerce: String,
  items: [String],
})

const customerSchema = new mongoose.Schema({
  customer_id: Number,
  customer_name: String,
  customer_email: String,
  customer_phone: String,
  ecommerce: String,
})

const storeSchema = new mongoose.Schema({
  store_id: Number,
  store_name: String,
  ecommerce: String,
  carts: [String]
})

const cartToCustomerSchema = new mongoose.Schema({
  cart_token: String,
  customer_id: Number,
})


// const productSchema = new mongoose.Schema({
//   product_id: Number,
//   product_name: String,
//   quantity: Number
// })

// const customerSchema = new mongoose.Schema({
//   customer_id: Number,
//   customer_phone: String,
//   ecommerce: String,
//   carts: [{type: mongoose.Schema.Types.ObjectId, ref:'Product'}]
// })

// const storeSchema = new mongoose.Schema({
//   store_id: Number,
//   store_name: String,
//   ecommerce: String,
//   customers: [{type: mongoose.Schema.Types.ObjectId, ref:'Customer'}]
// })

// const Product = mongoose.model('Product', productSchema);
// const Customer = mongoose.model('Customer', customerSchema);
// const Store = mongoose.model('Store', storeSchema);

const Cart = mongoose.model('Cart', cartSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Store = mongoose.model('Store', storeSchema);
const CartToCustomer = mongoose.model('CartToCustomer', cartToCustomerSchema)


module.exports = {
  Cart,
  Customer,
  Store,
  CartToCustomer,
}