// models/groupBalance.model.js
import mongoose from "mongoose";

const groupBalanceSchema = new mongoose.Schema({
  groupId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Group",
    required:true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  balance:{
    type:Number,
    default:0
  }
},{timestamps:true});

// One balance per user per group
groupBalanceSchema.index(
  { groupId:1, userId:1 },
  { unique:true }
);

const GroupBalance = mongoose.model("GroupBalance", groupBalanceSchema);
export default GroupBalance;
