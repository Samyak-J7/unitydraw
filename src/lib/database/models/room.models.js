import { Schema, model, models } from "mongoose";

const RoomSchema = new Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  editors: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
    required: true,
  },
  viewers: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const Room = models?.Room || model("Room", RoomSchema);

export default Room;
