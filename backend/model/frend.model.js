import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected","Add Friend"],
        default: "Add Friend"
    }
}, { timestamps: true });

const Frend = mongoose.model("Frend", friendSchema);
export default Frend;
