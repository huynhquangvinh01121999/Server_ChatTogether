var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ChatsSchema = new Schema(
  {
    FromUser: String,
    ToUser: String,
    FullName: String,
    Content: String,
    CreateAt: String,
  },
  {
    collection: "Chats",
  }
);
module.exports = mongoose.model("Chats", ChatsSchema);
