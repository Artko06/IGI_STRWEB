const { authJwt } = require("../middleware");

module.exports = app => {
    const categories = require("../controllers/category.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Category
    router.post("/", [authJwt.verifyToken, authJwt.isAdmin], categories.create);
  
    // Retrieve all Categories
    router.get("/", categories.findAll);
  
    // Retrieve a single Category with id
    router.get("/:id", categories.findOne);
  
    // Update a Category with id
    router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], categories.update);
  
    // Delete a Category with id
    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], categories.delete);
  
    app.use('/api/categories', router);
  };