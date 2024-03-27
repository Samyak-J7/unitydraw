import { Schema, model, models } from "mongoose";

const CanvasSchema = new Schema({
    canvasName: {
        type: String,
        default: "Untitled",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    canvasId:{
        type: String,
        required: true,
        unique: true,
    },
    canvasData:{
        type: Object,
        required: true,
    },
    
}, { timestamps: true}
);

const Canvas = models?.Canvas || model("Canvas", CanvasSchema);

export default Canvas