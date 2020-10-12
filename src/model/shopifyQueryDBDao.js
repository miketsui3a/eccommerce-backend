const mongoose = require("mongoose");

const { Store, Customer, CartToCustomer, Cart } = require("./schema");

const shopifyQueryDBDao = async (data) => {

    mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); // connect mongodb

    const shop = data.query.shop;

    const store = await Store.findOne({ store_name: shop })
    const carts = await Cart.find({ $and:[{cart_token: { $in: store.carts }},{items:{$exists:true, $not:{$size:0}}}]})
    const cartToCustomerRecords = await CartToCustomer.find({ cart_token: { $in: carts.map(x=>x.cart_token) } })
    const customers = await Customer.find({ customer_id: { $in: cartToCustomerRecords.map(x => x.customer_id) } })


    console.debug(customers)

    return customers

}

module.exports = {
    shopifyQueryDBDao,
};

