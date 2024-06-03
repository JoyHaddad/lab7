const { connectMongoDB } = require("../util/mongoDB.js");
const roomGenerator = require("../util/roomIdGenerator.js");
const chatRoom = require("../models/chatRoom.js");

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

module.exports = {
  getRoom,
  createRoom,
  listRooms,
};
