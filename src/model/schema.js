const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  cart_token: String,
  creation_date: {type: Date, default: Date.now},
  last_update_date: {type: Date, default: Date.now},
  ecommerce: String,
  items: {type: Array},
  last_remind: Date,
  reminded:{type:Boolean, default:false}
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
  carts: [String],
  checkout_auto_notice: {type: Boolean, default:true},
  abandon_checkout_remind: {type: Boolean, default:true},
  abandon_cart_remind: {type: Boolean, default:true},
  token: String,
})

const cartToCustomerSchema = new mongoose.Schema({
  cart_token: String,
  customer_id: Number,
})

const noticedCheckoutSchema = new mongoose.Schema({
  checkout_id: String,
  noticed_date: {type: Date, default: Date.now},
})


const Cart = mongoose.model('Cart', cartSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Store = mongoose.model('Store', storeSchema);
const CartToCustomer = mongoose.model('CartToCustomer', cartToCustomerSchema)
const NoticedCheckout = mongoose.model('NoticedCheckout', noticedCheckoutSchema)


module.exports = {
  Cart,
  Customer,
  Store,
  CartToCustomer,
  NoticedCheckout,
}