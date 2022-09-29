import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();
    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);

    //check if roomId exist
    if (roomIdx === -1) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }

    //find room and return
    return res.json({ ok: true, messages: rooms[roomIdx].messages });
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);

    //check if roomId exist
    if (roomIdx === -1) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }

    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const newMessage = {
      messageId: uuidv4(),
      text: req.body.text,
      username: user.username,
    };
    rooms[roomIdx].messages.push(newMessage);
    writeChatRoomsDB(rooms);
    return res.json({ ok: true, message: newMessage });
  }
}
