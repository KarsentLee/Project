const db = require("../data/database");
const mongodb = require("mongodb");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image;
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    console.log("in findbyId func: ", productId);
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
      console.log("lets see if mongodb object id conversion works: ", prodId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("could not find product with provided id");
      error.code = 404;
      throw error;
    }
    console.log("pr: ", product._id);
    return new Product(product);
  }

  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) {
      console.log("this id: ", this.id);
      const productId = new mongodb.ObjectId(this.id);
      console.log(productId);

      if (!this.image) {
        delete productData.image;
      }

      await db.getDb().collection("products").updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
    } else {
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: productId });
  }
}
module.exports = Product;
