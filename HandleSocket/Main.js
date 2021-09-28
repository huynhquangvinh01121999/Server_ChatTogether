const Users = require("../Models/Users.js");
const Chats = require("../Models/Chats.js");

module.exports = (io) => {
  var LIST_CLIENT = [];
  io.on("connection", (client) => {
    // console.log(`${client.id} connected`);

    // Bước 1
    // khi client connnect vào thì gửi idClient qua cho CLient
    client.emit("sendClientId", client.id);

    // Bước 4
    // lắng nghe khi client phản hồi sau khi server gửi id qa -> tiến hành update lại clientId cho user connect
    client.on("replySendClientId", (userInfo) => {
      // console.log("Bước 2 - " + userInfo + "-" + client.id);

      // Bước 5: phản hồi để client cập nhật lại ds các user online
      io.emit("updateReducerUsers_ClientId", {
        clientId: client.id,
        userInfo: userInfo,
        status: true,
      });

      // push userInfo vô LIST_CLIENT để khỏi mock db
      // if (LIST_CLIENT.length == 0) {
      //   LIST_CLIENT.push({ userInfo: userInfo, clientId: client.id });
      // } else {
      //   LIST_CLIENT.forEach((item) => {
      //     if (item.userInfo != userInfo) {
      //       LIST_CLIENT.push({ userInfo: userInfo, clientId: client.id });
      //     } else {
      //       item.clientId = client.id;
      //     }
      //   });
      // }

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
        })
        .catch((err) => {
          // console.log(err);
        });
    });

    // Bước 7: nghe client disconnect (tắt trình duyệt)
    client.on("disconnecting", (data) => {
      // LIST_CLIENT.splice(LIST_CLIENT.indexOf(client), 1);
      // console.log(LIST_CLIENT);

      // Bước 8: gửi thông báo cho các Client khác là có một user mới disconnect (tắt trình duyệt)
      io.emit("notifiDisconnect", client.id);
    });

    // Bước 11: nhận phản hồi từ client xác nhận hủy kết nối - tiến hành update lại status trong db
    client.on("acceptDisconnect", (clientId) => {
      // Bước 12: Gửi thông báo đến các client khác để update lại state status
      io.emit("clientLogouted", clientId);
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

    // Từ bước này trở đi là dành cho các thao tác

    // Bước 12
    // lắng nghe khi client Login vô -> update lại trạng thái cho user đó online
    client.on("setOnlineLogin", (data) => {
      io.emit("replySetOnline", {
        clientId: client.id,
        userInfo: data,
        status: true,
      });
    });

    client.on("updateUserInbox", (data) => {
      // console.log(data);
      io.emit("reUpdateUserInbox", { data, ClientId: client.id });
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

    client.on("send-mess", (data) => {
      const clientId = data.clientId;
      // var result = LIST_CLIENT.filter(
      //   (client) => client.userInfo === data.ToUser
      // );
      // console.log(data.userInbox.ClientId);
      io.to(clientId).emit("recei-mess", data.request);
      // client.emit("recei-mess", { ClientId: client.id, Content: data });
      // io.emit("recei-mess", data.request);
    });
  });
};
