var mongoose = require("mongoose");

function connectionDB() {
  const uri =
    "...";

  mongoose
    .connect(process.env.MONGODB_URI || uri, {
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
