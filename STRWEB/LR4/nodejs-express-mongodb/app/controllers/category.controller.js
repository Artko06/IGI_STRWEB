const db = require("../models");
const Category = db.categories;
const Product = db.products;

exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const category = new Category({
        name: req.body.name,
        description: req.body.description,
    });

    category
        .save(category)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Category."
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

    Category.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Category.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Category with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Category with id=" + id });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Category.findByIdAndUpdate(id, req.body, { new: true })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Category with id=${id}. Maybe Category was not found!`
                });
            } else res.send({ message: "Category was updated successfully.", data: data });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Category with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Product.updateMany({ category: id }, { $set: { category: null } })
        .then(() => {
            Category.findByIdAndDelete(id)
                .then(data => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
                        });
                    } else {
                        res.send({
                            message: "Category was deleted successfully!"
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Could not delete Category with id=" + id
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating products before deleting category. " + err.message
            });
        });
};