var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsersSchema = new Schema(
  {
    UserName: String,
    Password: String,
    FullName: String,
    Email: String,
    Phone: String,
    ClientId: String,
    Status: Boolean,
  },
  {
    collection: "Users",
  }
);
module.exports = mongoose.model("Users", UsersSchema);
