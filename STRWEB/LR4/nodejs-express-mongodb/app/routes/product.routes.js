const { authJwt } = require("../middleware");
module.exports = app => {
    const products = require("../controllers/product.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Product
    router.post("/", [authJwt.verifyToken, authJwt.isAdmin], products.create);
  
    // Retrieve all Products
    router.get("/", products.findAll);
  
    // Retrieve a single Product with id
    router.get("/:id", products.findOne);
  
    // Update a Product with id
    router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], products.update);
  
    // Delete a Product with id
    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], products.delete);
  
    app.use('/api/products', router);
  };