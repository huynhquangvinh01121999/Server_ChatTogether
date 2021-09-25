const Users = require("../Models/Users.js");
const Chats = require("../Models/Chats.js");

module.exports = (io) => {
  var LIST_CLIENT = [];
  io.on("connection", (client) => {
    // console.log(`${client.id} connected`);

    client.on("updateUserInbox", (data) => {
      // console.log(data);
      io.emit("reUpdateUserInbox", { data, ClientId: client.id });
    });

    // khi client connnect vào thì gửi idClient qua cho CLient
    client.emit("sendClientId", client.id);

    // lắng nghe khi client phản hồi sau khi server gửi id qa -> tiến hành update lại clientId cho user connect
    client.on("replySendClientId", (userInfo) => {
      // push userInfo vô LIST_CLIENT để khỏi mock db
      if (LIST_CLIENT.length == 0) {
        LIST_CLIENT.push({ userInfo: userInfo, clientId: client.id });
      } else {
        LIST_CLIENT.forEach((item) => {
          if (item.userInfo != userInfo) {
            LIST_CLIENT.push({ userInfo: userInfo, clientId: client.id });
          } else {
            item.clientId = client.id;
          }
        });
      }

      // cập nhật lại trong db
      Users.findOneAndUpdate(
        {
          UserName: userInfo,
        },
        {
          $set: {
            ClientId: client.id,
            Status: true,
          },
        }
      )
        .then((data) => {
          // console.log(LIST_CLIENT);
          io.emit("updateReducerUsers_ClientId", {
            clientId: client.id,
            userInfo: userInfo,
            status: true,
          });
        })
        .catch((err) => {
          // console.log(err);
        });
    });

    // gửi thông báo cho các Client khác là có một user mới disconnect
    client.on("disconnecting", (data) => {
      // LIST_CLIENT.splice(LIST_CLIENT.indexOf(client), 1);
      // console.log(LIST_CLIENT);
      io.emit("notifiDisconnect", client.id);
    });

    // client phản hồi user này đã disconnect và tiến hành update lại status trong db
    client.on("acceptDisconnect", (clientId) => {
      Users.findOneAndUpdate(
        {
          ClientId: clientId,
        },
        {
          $set: {
            Status: false,
          },
        }
      )
        .then((data) => {
          // console.log(data);
        })
        .catch((err) => {});
    });

    client.on("saveMessToDb", (data) => {
      // console.log(data);
      var request = {
        FromUser: data.FromUser,
        ToUser: data.ToUser,
        Content: data.Content,
        CreateAt: data.CreateAt,
      };
      Chats.create(request)
        .then((data) => {})
        .catch((err) => {
          res
            .status(500)
            .json("Server đang gặp lỗi không thể tạo mới công việc");
        });
    });

    client.on("sendMess", (data) => {
      // var result = LIST_CLIENT.filter(
      //   (client) => client.userInfo === data.ToUser
      // );
      console.log(data.userInbox.ClientId);
      io.to(data.userInbox.ClientId).emit("replySendMess", data);
    });
  });
};
