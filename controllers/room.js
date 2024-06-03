const { connectMongoDB } = require("../util/mongoDB.js");
const roomGenerator = require("../util/roomIdGenerator.js");
const chatRoom = require("../models/chatRoom.js");
const moment = require("moment");

async function getRoom(request, response) {
  try {
    const roomName = request.params.roomName;
    await connectMongoDB();
    const existingRoom = await chatRoom.findOne({ roomName });
    if (existingRoom) {
      response.render("room", {
        title: "chatroom",
        roomName,
        newRoomId: roomGenerator.roomIdGenerator(),
      });
      return;
    }
    response
      .status(404)
      .send("<h1>404 Room not found!</h1><a href='/'>Go back to home</a>");
  } catch (error) {
    console.error(error);
  }
}

async function listRooms(request, response) {
  try {
    await connectMongoDB();
    const rooms = await chatRoom.find();
    response.send(rooms);
  } catch (error) {
    console.error(error);
  }
}

async function createRoom(request, response) {
  try {
    let { roomName } = request.body;
    console.log(roomName);
    if (!roomName) {
      roomName = roomGenerator.roomIdGenerator();
    }
    await connectMongoDB();
    const existingRoom = await chatRoom.findOne({ roomName });
    if (existingRoom) {
      response.status(400).send({ error: "Room name already exists." });
      return;
    }
    await chatRoom.create({ roomName });
    response.send({ roomName });
  } catch (error) {
    console.error(error);
  }
}

async function sendMessage(request, response) {
  try {
    const { roomName, sender, content } = request.body;
    await connectMongoDB();

    const room = await chatRoom.findOne({ roomName });
    if (!room) {
      response.status(404).send("Room not found");
      return;
    }

    room.messages.push({ sender, content });
    await room.save();
    response.status(201).send({ message: "Message added successfully", room });
  } catch (error) {
    console.error(error);
    response.status(500).send("Failed to send message");
  }
}

async function getMessages(request, response) {
  try {
    const roomName = request.params.roomName;
    await connectMongoDB();

    const room = await chatRoom.findOne({ roomName });
    if (!room) {
      response.status(404).send("Room not found");
      return;
    }

    const today = moment().startOf("day");

    const messagesWithFormattedTimestamps = room.messages.map((message) => {
      const messageDate = moment(message.timestamp);
      if (messageDate.isSame(today, "day")) {
        return {
          ...message.toObject(),
          timestamp: messageDate.format("h:mm A"),
        };
      } else {
        return {
          ...message.toObject(),
          timestamp: messageDate.fromNow(),
        };
      }
    });

    response.send({ roomName, messages: messagesWithFormattedTimestamps });
  } catch (error) {
    console.error(error);
    response.status(500).send("Failed to retrieve messages");
  }
}

module.exports = {
  getRoom,
  createRoom,
  listRooms,
  sendMessage,
  getMessages,
};
