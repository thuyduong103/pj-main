const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var subcategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bcategories",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("subcategories", subcategorySchema);