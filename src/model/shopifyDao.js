const mongoose = require("mongoose");
const fetch = require('node-fetch')

const { Store, Customer, Cart, CartToCustomer } = require("./schema");

const shopifyDao = async (data) => {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); // connect mongodb

  const customer_id = data.body.customer_id;
  const customer_phone = data.body.customer_phone;
  const response = data.body.response;

  console.log('resresres',response)

  let store = await Store.findOne({
    store_name: data.body.shop,
  });

  if (store === null) {
    console.debug('cannot find store, create one in db')
    store = new Store({
      store_name: data.body.shop,
      ecommerce: "shopify",
    });

    console.log(response.token)
    // store.carts.push(response.token);
    store.save();
  }/* else {
    if (store.carts.includes(response.token)) {
      console.debug('already in the cart list')
    } else {
      console.debug('store exist but cart not in the ')//??
      store.carts.push(response.token);
      store.save();
    }
  }*/


  if (customer_id) {
    let customer = await Customer.findOne({
      ecommerce: "shopify",
      customer_id: customer_id,
    });

    console.log(customer_id)

    if (customer === null) {
      console.debug('cannot find customer, create 1 DB')

      //change customer phone


      customer = new Customer({
        customer_id: customer_id,
        customer_phone: customer_phone,
        ecommerce: "shopify",
      });

      customer.save();
    } else {
      if (!customer.customer_phone && customer_phone) {
        //update phone number
        customer.customer_phone = customer_phone
        await customer.save()
      }
    }

    let cartToCustomerRecord = await CartToCustomer.findOne({
      cart_token: response.token,
      customer_id: customer_id,
    });

    if (cartToCustomerRecord === null) {
      console.debug('cannot find cartTCR given token and userID')
      cartToCustomerRecord = await CartToCustomer.findOne({
        customer_id: customer_id,
      });

      await CartToCustomer.findOneAndDelete({ cart_token: response.token });


      //maybe need to delete the cart db too...

      if (cartToCustomerRecord === null) {
        console.debug('cannot find cartTCR given userID')
        cartToCustomerRecord = new CartToCustomer({
          cart_token: response.token,
          customer_id: customer_id,
        });
        if(!store.carts.includes(response.token)){
          store.carts.push(response.token)
          store.save()
        }
        cartToCustomerRecord.save();
      } else {
        console.debug('find the userID in the cartTCR but the cartToken is wrong')
        store.carts.splice(store.carts.indexOf(cartToCustomerRecord.cart_token),1)
        store.carts.push(response.token)
        //delete old cart in the store.carts array
        store.save()
        cartToCustomerRecord.cart_token = response.token;
        cartToCustomerRecord.save();

      }
    }
  }
};

module.exports = {
  shopifyDao,
};
