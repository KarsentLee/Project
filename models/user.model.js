const bcrypt = require("bcryptjs");

const db = require("../data/database");

// 'User' class is the representation of users document in the database(online-shop)

class User {
  // use this constructor to create a user document with user input values
  // note that this constructor is the schema of user document
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = {
      street: street,
      postal: postal,
      city: city,
    };
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async signup() {
    // hash the user password before storing it in the database
    const hashedPassword = await bcrypt.hash(this.password, 12);

    // create users document collection if it doesn't exist then store the user document in the users collection
    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
