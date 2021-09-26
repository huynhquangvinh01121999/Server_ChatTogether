let Chats = require("../Models/Chats");

function getMessagesToMe(req, res) {
  Chats.find({
    $or: [{ FromUser: req.query.username }, { ToUser: req.query.username }],
  }).exec((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json(data);
    }
  });
}

function getMessagesFromUser(req, res) {
  Chats.find({
    FromUser: req.body.fromUser,
    ToUser: req.body.toUser,
  })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => res.status(500).json(err));
}

module.exports = (app) => {
  app.get("/getMessagesToMe", (req, res) => {
    getMessagesToMe(req, res);
  });

  app.get("/getMessagesFromUser", (req, res) => {
    getMessagesFromUser(req, res);
  });
};
