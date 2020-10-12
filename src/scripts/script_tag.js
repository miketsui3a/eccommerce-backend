console.log('Script tag is running!!')
var oldXHR = window.XMLHttpRequest;


/*
This script wull be automatically embedded into
the shopify store.

This script is for listening the cart action and 
send back the data to the backend.
*/

function newXHR() {
  var realXHR = new oldXHR();
  realXHR.addEventListener(
    "load",
    function () {
      if (realXHR.readyState == 4 && realXHR.status == 200) {
        const response = JSON.parse(realXHR.response)
        if (realXHR._url === "/cart.js" || realXHR._url === "/cart/change.js") {
          console.log(realXHR._url)
          console.log(response)
          fetch('https://a1e60cec67c8.ngrok.io/api/v1/cart', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shop: Shopify.shop,
              ecommerce: 'shopify',
              end_point: realXHR._url,
              customer_id: customerid,
              customer_phone: customerphone || null,
              response: response
            }),
          });
        }
      }
    },
    false
  );
  return realXHR;
}
window.XMLHttpRequest = newXHR;


(function (ns, fetch) {
  if (typeof fetch !== 'function') return;

  ns.fetch = function () {
    const response = fetch.apply(this, arguments);

    response.then(res => {
      if ([
        `${window.location.origin}/cart/cart.js`,
        `${window.location.origin}/cart/update.js`,
        `${window.location.origin}/cart/change.js`,
        `${window.location.origin}/cart/clear.js`,
      ].includes(res.url)) {
        console.log(res)
        res.json().then(data => {
          console.log(data)
          fetch('https://a1e60cec67c8.ngrok.io/api/v1/cart', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shop: Shopify.shop,
              ecommerce: 'shopify',
              customer_id: customerid,
              customer_phone: customerphone || null,
              response: data
            }),
          });
        });
      }
    });

    return response;
  }

}(window, window.fetch))
