let Users = require("../Models/Users");

function getAll(res) {
  Users.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(data);
    }
  });
}

function createUser(req, res) {
  var fullname = req.body.fullname;
  var email = req.body.email;
  var phone = req.body.phone;
  var username = req.body.username;
  var password = req.body.password;
  Users.findOne({
    UserName: username,
  })
    .then((data) => {
      if (data) {
        res
          .status(201)
          .json({ status: false, message: "Tên tài khoản đã tồn tại!!!" });
      } else {
        Users.create({
          FullName: fullname,
          Email: email,
          Phone: phone,
          UserName: username,
          Password: password,
        });
      }
    })
    .then((data) => {
      res
        .status(201)
        .json({ status: true, message: "Đăng ký tài khoản thành công" });
    })
    .catch((err) => {
      res.status(500).json({ status: "Tạo tài khoản thất bại" });
    });
}

function authen(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  Users.findOne({
    UserName: username,
  })
    .then((data) => {
      if (data) {
        if (data.Password != password) {
          res.status(201).json({
            status: false,
            message: "Sai mật khẩu",
          });
        } else {
          res.status(201).json({
            status: true,
            message: "Đăng nhập thành công",
          });
        }
      } else {
        res.status(201).json({ status: false, message: "Sai tên đăng nhập" });
      }
    })
    .catch((err) => {
      res.status(500).json("Đăng nhập thất bại");
    });
}

module.exports = (app) => {
  app.get("/", (req, res) => {
    res.send("Đây là Server Chat Socket - Client sử dụng công nghệ MERN");
  });

  app.get("/getUsers", (req, res) => {
    getAll(res);
  });

  app.post("/createUser", (req, res) => {
    createUser(req, res);
  });

  app.post("/authen", (req, res) => {
    authen(req, res);
  });
};
