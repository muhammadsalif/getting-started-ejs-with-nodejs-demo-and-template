// load the things we need
var express = require("express");
var app = express();
const bodyParser = require("body-parser");

// required module to make calls to a REST API
const axios = require("axios");

app.use(bodyParser.urlencoded());

// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/index", {
    showAverage: false, // initially hide the average calculation
  });
});

app.post("/load-data", function (req, res) {
  axios
    .get("https://dummyjson.com/carts")
    .then(function (response) {
      const cartData = response.data;
      const averages = {};

      if (cartData && cartData.carts && cartData.carts.length) {
        // check for existence of cartData
        cartData.carts.forEach(function (cart) {
          let totalSum = 0;
          let totalQuantity = 0;

          cart.products.forEach(function (product) {
            totalSum += product.price * product.quantity;
            totalQuantity += product.quantity;
          });

          let cartAverage = totalSum / totalQuantity;
          averages[cart.id] = cartAverage.toFixed(2);
        });

        res.render("pages/index", { showAverage: true, averages });
      } else {
        res.render("pages/index", { showAverage: false });
      }
    })
    .catch(function (error) {
      console.error("Error", error);
      res.render("pages/index", { showAverage: false });
    });
});

app.listen(8080);
console.log("8080 is the magic port");
