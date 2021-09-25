var mongoose = require("mongoose");

function connectionDB() {
  const uri =
    "mongodb+srv://vinhhuynh:01121999@cluster0.27arp.mongodb.net/dbChatSocket?retryWrites=true&w=majority";

  mongoose
    .connect(process.env.MONGO_CONECTION || uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(
      () => {
        console.log("Ket noi db thanh cong");
      },
      (err) => {
        console.log("Ket noi db that bai");
      }
    );
}

module.exports = () => {
  connectionDB();
};
