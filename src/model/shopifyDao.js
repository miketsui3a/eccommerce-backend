const mongoose = require("mongoose");

const { Store, Customer, Cart, CartToCustomer } = require("./schema");

const shopifyDao = async (data) => {
  mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); // connect mongodb

  const customer_id = data.body.customer_id;
  const customer_phone = data.body.customer_phone;
  const customer_name = data.body.customer_name;
  const customer_email = data.body.customer_email;
  const response = data.body.response;

  let store = await Store.findOne({
    store_name: data.body.shop,
  });

  if (store === null) {
    store = new Store({
      store_name: data.body.shop,
      ecommerce: "shopify",
    });

    store.carts.push(response.token);
    store.save();
  }

  if (customer_id) {
    let customer = await Customer.findOne({
      ecommerce: "shopify",
      customer_id: customer_id,
    });

    if (customer === null) {
      customer = new Customer({
        customer_id: customer_id,
        customer_phone: customer_phone,
        customer_email: customer_email,
        customer_name: customer_name,
        ecommerce: "shopify",
      });

      customer.save();
    } else {
      if (customer.customer_phone === null && customer_phone) {
        //update phone number
      }
    }

    let cartToCustomerRecord = await CartToCustomer.findOne({
      cart_token: response.token,
      customer_id: customer_id,
    });

    if (cartToCustomerRecord === null) {
      cartToCustomerRecord = await CartToCustomer.findOne({
        customer_id: customer_id,
      });

      await CartToCustomer.findOneAndDelete({ cart_token: response.token });
      console.log(response.token)

      if (cartToCustomerRecord === null) {
        cartToCustomerRecord = new CartToCustomer({
          cart_token: response.token,
          customer_id: customer_id,
        });
        cartToCustomerRecord.save();
      } else {
        cartToCustomerRecord.cart_token = response.cart_token;
        cartToCustomerRecord.save();
      }
    }
  }

  // let products_in_db = [];
  // let product_in_cart = [];

  // let customer = await Customer.findOne({
  //   ecommerce: "shopify",
  //   customer_id: customer_id,
  // });

  // let store = await Store.findOne({
  //   store_name: data.body.shop,
  // })
  // // if the store is not yet registered in the db
  // if(store === null){
  //   store = new Store({
  //     store_name: data.body.shop,
  //     ecommerce: "shopify",
  //   });
  // }

  // // if the customer is not yet registered in the db
  // if (customer === null) {
  //   customer = new Customer({
  //     customer_id: customer_id,
  //     customer_phone: customer_phone,
  //     ecommerce: "shopify",
  //   });

  //   await customer.save();
  //   store.customers.push(customer)

  //   console.log(customer.customer_id, " join!");
  // }

  // await store.save()

  // products_in_db = await Customer.findOne({
  //   ecommerce: "shopify",
  //   customer_id: customer_id,
  // }).populate({
  //   path: "carts",
  // });

  // products_in_db = products_in_db.carts

  // if (!products_in_db){
  //   console.log("shit")
  //   products_in_db = []
  // }

  // console.log("product_in_db", products_in_db);

  // if (data.body.end_point === "/cart/change.js") {
  //   console.log("This action is /cart/change.js");

  //   let product_in_db_id_tmp = []
  //   products_in_db.map(obj=>product_in_db_id_tmp.push(obj.product_id))

  //   // create new product(s) in case the product is not in the db
  //   const product_to_be_create = response.items.filter(obj=>product_in_db_id_tmp.indexOf(obj.product_id)===-1)
  //   console.log('product_to_be_create', product_to_be_create)
  //   product_to_be_create.map(async obj=>{
  //     let product = new Product({
  //       product_id: obj.product_id,
  //       quantity: obj.quantity,
  //     })
  //     await product.save()
  //     customer.carts.push(product)
  //     await customer.save()
  //   })

  //   response.items.map(async (item) => {
  //     console.log("item", item);
  //     product_in_cart.push(item.product_id);

  //     console.log('product_in_db',products_in_db)

  //     const product_to_update = products_in_db.filter(x=>x.product_id === item.product_id)
  //     console.log('product_to_update',product_to_update)

  //     await Product.findByIdAndUpdate({_id: product_to_update[0]._id}, {quantity: item.quantity})
  //   });

  //   const product_to_be_delete = products_in_db.filter(obj=>product_in_cart.indexOf(obj.product_id) === -1)

  //   product_to_be_delete.map(async item=>{
  //     await Product.findByIdAndDelete(item._id)
  //     await Customer.findByIdAndUpdate(customer._id,{$pull:{carts:item._id}})
  //   })
  // }else if(data.body.end_point === "/cart/add.js"){ // if the action is add to cart
  //   let create_flag = true
  //   let _id_tmp
  //   products_in_db.map(async item=>{
  //     if(item.product_id===response.product_id){
  //       _id_tmp = item._id
  //       create_flag = false
  //     }
  //   })
  //   // if the product is not in the db
  //   if(create_flag){
  //     const product = new Product({
  //       product_id: response.product_id,
  //       quantity: 1
  //     })
  //     await product.save()
  //     customer.carts.push(product)
  //     await customer.save()
  //   }else{
  //     await Product.findByIdAndUpdate(_id_tmp,{
  //       $inc:{quantity: 1}
  //     })
  //   }
  // }
};

module.exports = {
  shopifyDao,
};
