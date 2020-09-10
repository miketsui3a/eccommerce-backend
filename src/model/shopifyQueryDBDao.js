const mongoose = require("mongoose");

const { Store, Customer, Product } = require("./schema");

const shopifyQueryDBDao = async (data) => {

    mongoose.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); // connect mongodb

    const shop = data.query.shop;

    const stores = await Store.findOne({store_name: shop}).populate({
        path: 'customers',
    })

    console.debug(stores)

    return stores

}

module.exports = {
    shopifyQueryDBDao,
};

