const mongoose = require("mongoose");

const { Store, Customer, CartToCustomer } = require("./schema");

const shopifyQueryDBDao = async (data) => {

    mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); // connect mongodb

    const shop = data.query.shop;

    const store = await Store.findOne({ store_name: shop })
    const cartToCustomerRecords = await CartToCustomer.find({ cart_token: { $in: store.carts } })
    const customers = await Customer.find({ customer_id: { $in: cartToCustomerRecords.map(x => x.customer_id) } })


    console.debug(customers)

    return customers

}

module.exports = {
    shopifyQueryDBDao,
};

