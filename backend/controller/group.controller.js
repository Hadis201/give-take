import Group from "../model/group.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../model/user.model.js";
import Frend from "../model/frend.model.js";
import GroupBalance from "../model/balance.model.js";
import Expense from "../model/expense.model.js";

export const createGroup = asyncHandler(async (req, res) => {
  const { name, description, membernames } = req.body;
  const creatorId = req.user._id;

  if (!name) {
    throw new ApiError(400, "Group name is required");
  }

  let memberIds = [creatorId];

  if (membernames && Array.isArray(membernames) && membernames.length > 0) {
    const uniquenames = [...new Set(membernames)];

    const foundUsers = await User.find(
      { name: { $in: uniquenames } },
      { _id: 1, name: 1 }
    ).lean();

    const foundIds = foundUsers.map((user) => user._id);

    memberIds = [...new Set([...memberIds, ...foundIds])];
  }

  const newGroup = new Group({
    name,
    description: description || "",
    members: memberIds,
  });

  await newGroup.save();

  await User.updateMany(
    { _id: { $in: memberIds } },
    { $addToSet: { groups: newGroup._id } }
  );

  await Promise.all(
    memberIds.map((memberId) =>
      GroupBalance.create({
        groupId: newGroup._id,
        userId: memberId,
        balance: 0,
      })
    )
  );

  const populatedGroup = await Group.findById(newGroup._id).populate(
    "members",
    "name username email"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedGroup, "Group created successfully"));
});



export const addMembersToGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { membernames } = req.body;
  const requestingUserId = req.user._id;

  if (!membernames || !Array.isArray(membernames) || membernames.length === 0) {
    throw new ApiError(400, "At least one member name is required");
  }


  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  const isMember = group.members.some(
    (mem) => mem.toString() === requestingUserId.toString()
  );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this group. Only members can add others.");
  }


  const uniqueNames = [...new Set(membernames.map(n => n.trim()))];

  const foundUsers = await User.find(
    { name: { $in: uniqueNames } },
    { _id: 1 }
  ).lean();

  if (foundUsers.length === 0) {
    throw new ApiError(404, "No valid users found with the provided names");
  }

  const newMemberIds = foundUsers.map(u => u._id);


  await Group.updateOne(
    { _id: groupId },
    { $addToSet: { members: { $each: newMemberIds } } }
  );


  await User.updateMany(
    { _id: { $in: newMemberIds } },
    { $addToSet: { groups: groupId } }
  );


  const updatedGroup = await Group.findById(groupId)
    .populate("members", "name email phonenumber");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedGroup, "Members added successfully"));
});

// export const getGroupDetails = asyncHandler(async(req,res)=>{
//   const {grooupId} = req.params;
//   const group = await Group.findById(grooupId).populate("members", "name email phonenumber");
//   if(!group){
//     throw new ApiError(404,"Group not found");
//   }

// })

export const getUserGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find({ members: req.user._id });
    
    return res.status(200).json(
        new ApiResponse(200, groups, "Groups fetched successfully")
    );
});



export const getGroupDetails = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    // 1. Basic Group Info
    const group = await Group.findById(groupId).populate("members", "name email");
    
    // 2. Expense Items
    const expenses = await Expense.find({ groupId })
        .populate("items.paidBy", "name")
        .populate("items.sharedBy", "name");

    // 3. Individual Member Balances in this group
    const balances = await GroupBalance.find({ groupId })
        .populate("userId", "name");

    return res.status(200).json(
        new ApiResponse(200, {
            groupName: group.name,
            totalMembers: group.members.length,
            members: group.members,
            expenses,
            memberBalances: balances
        }, "Group details fetched successfully")
    );
});
export default { createGroup };


