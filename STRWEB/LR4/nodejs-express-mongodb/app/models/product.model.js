module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: {
            type: String,
            required: true
        },
        description: String,
        price: {
            type: Number,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category"
        },
        quantity: Number
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    const Product = mongoose.model("product", schema);
    return Product;
  };
