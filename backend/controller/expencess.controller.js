import Expense from "../model/expense.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";  
import Group from "../model/group.model.js";
import User from "../model/user.model.js";
import GroupBalance from "../model/balance.model.js";

export const createExpense = asyncHandler(async (req, res) => {

  const { groupId, items } = req.body;
  const userId = req.user._id;

  if (!groupId || !items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "GroupId and items are required");
  }

  // Check group
  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  // Optional: ensure request user is group member
  if (!group.members.includes(userId)) {
    throw new ApiError(403, "You are not a member of this group");
  }

  let totalAmount = 0;

  // 🔁 Process each item
  for (const item of items) {

    const { itemName, itemPrice, givername, takersname } = item;

    const uniquenames = Array.isArray(takersname) ? takersname : [takersname];

    const sharedBy = await User.find(
      { name: { $in: uniquenames } },
      { _id: 1}
    ).lean();
    if(sharedBy.length !== uniquenames.length) {
      throw new ApiError(400, "Some takers not found");
    }
    const paidBy = await User.findOne({ name: givername }, { _id: 1 }).lean();
    if(!paidBy) {
      throw new ApiError(400, "Giver not found");
    }

    if (!itemName || !itemPrice || !paidBy || !sharedBy?.length) {
      throw new ApiError(400, "Invalid item data");
    }

    totalAmount += itemPrice;

    const splitAmount = itemPrice / sharedBy.length;

    // ✅ Payer gets money back (except his share)
    await GroupBalance.findOneAndUpdate(
      { groupId, userId: paidBy._id},
      { $inc: { balance: itemPrice - splitAmount } },
      { upsert: true }
    );

    // ✅ Shared members pay their share
    for (const member of sharedBy) {
      if (member._id.toString() === paidBy._id.toString()) continue;

      await GroupBalance.findOneAndUpdate(
        { groupId, userId: member._id },
        { $inc: { balance: -splitAmount } },
        { upsert: true }
      );
    }
  }

  // Save expense document
  const expense = await Expense.create({
    groupId,
    items,
    totalAmount
  });

  return res.status(201).json(
    new ApiResponse(201, expense, "Expense added successfully")
  );
});




export const addexpenseItem = asyncHandler(async (req, res) => {

  const { groupId, items } = req.body;
  const userId = req.user._id;

  if (!groupId || !items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "groupId and items are required");
  }

  // Check group
  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  if (!group.members.includes(userId)) {
    throw new ApiError(403, "You are not a member of this group");
  }

  // Find existing expense for group
  let expense = await Expense.findOne({ groupId });

  let addedAmount = 0;

  // 🔁 Process items
  for (const item of items) {

    const { itemName, itemPrice, givername, takersname } = item;
    
    if (!itemName || !itemPrice || !givername || !takersname) {
      throw new ApiError(400, "Invalid item data");
    }

    const uniquenames = Array.isArray(takersname) ? takersname : [takersname];

    const sharedBy = await User.find(
      { name: { $in: uniquenames } },
      { _id: 1}
    ).lean();
    if(sharedBy.length !== uniquenames.length) {
      throw new ApiError(400, "Some takers not found");
    }
    const paidBy = await User.findOne({ name: givername }, { _id: 1 }).lean();
    if(!paidBy) {
      throw new ApiError(400, "Giver not found");
    }


    // Validate members
    if (!group.members.some(m => m.toString() === paidBy._id.toString())) {
      throw new ApiError(400, "PaidBy user not in group");
    }

    for (const m of sharedBy) {
      if (!group.members.some(gm => gm.toString() === m._id.toString())) {
        throw new ApiError(400, "SharedBy user not in group");
      }
    }

    addedAmount += itemPrice;

    const splitAmount = itemPrice / sharedBy.length;

    // payer
    await GroupBalance.findOneAndUpdate(
      { groupId, userId: paidBy._id },
      { $inc: { balance: itemPrice - splitAmount } },
      { upsert: true }
    );

    // shared users
    for (const member of sharedBy) {
      if (member._id.toString() === paidBy._id.toString()) continue;

      await GroupBalance.findOneAndUpdate(
        { groupId, userId: member._id },
        { $inc: { balance: -splitAmount } },
        { upsert: true }
      );
    }
  }

  // Create or Update expense
  if (!expense) {
    expense = await Expense.create({
      groupId,
      items,
      totalAmount: addedAmount
    });
  } else {
    expense.items.push(...items);
    expense.totalAmount += addedAmount;
    await expense.save();
  }

  return res.status(200).json(
    new ApiResponse(200, expense, "Items added successfully")
  );
});



export const settlePayment = asyncHandler(async (req, res) => {

  const { groupId, fromUserId, toUserId, amount } = req.body;

  if (!groupId || !fromUserId || !toUserId || !amount) {
    throw new ApiError(400, "All fields are required");
  }

  if (fromUserId === toUserId) {
    throw new ApiError(400, "Cannot settle with same user");
  }

  // fromUser gives money → balance increases
  await GroupBalance.findOneAndUpdate(
    { groupId, userId: fromUserId },
    { $inc: { balance: amount } }
  );

  // toUser receives money → balance decreases
  await GroupBalance.findOneAndUpdate(
    { groupId, userId: toUserId },
    { $inc: { balance: -amount } }
  );

  return res.status(200).json(
    new ApiResponse(200, null, "Payment settled successfully")
  );
});

