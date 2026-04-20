const Group = require("../models/Group");
const GroupMessage = require("../models/GroupMessage");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

function toPublicMember(user) {
  return {
    id: user._id,
    nickname: `Student-${user.anonymousId.slice(0, 6)}`,
  };
}

function toPublicGroup(group, currentUserId) {
  const memberObjects = (group.members || []).map(toPublicMember);

  return {
    _id: group._id,
    name: group.name,
    description: group.description,
    interest: group.interest,
    createdAt: group.createdAt,
    createdBy: group.createdBy ? toPublicMember(group.createdBy) : null,
    members: memberObjects,
    memberCount: memberObjects.length,
    isJoined: memberObjects.some((member) => String(member.id) === String(currentUserId)),
  };
}

function toPublicMessage(messageDoc) {
  return {
    _id: messageDoc._id,
    message: messageDoc.message,
    createdAt: messageDoc.createdAt,
    author: toPublicMember(messageDoc.authorId),
  };
}

async function getGroupForMember(groupId, userId) {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new AppError("Group not found.", 404);
  }

  const isMember = group.members.some((memberId) => String(memberId) === String(userId));

  if (!isMember) {
    throw new AppError("Join the group to access messages.", 403);
  }

  return group;
}

const listGroups = asyncHandler(async (req, res) => {
  const interest = (req.query.interest || "").trim();
  const query = interest ? { interest: new RegExp(`^${interest}$`, "i") } : {};

  const groups = await Group.find(query)
    .populate("createdBy", "anonymousId")
    .populate("members", "anonymousId")
    .sort({ createdAt: -1 });

  res.json({
    message: "Groups fetched.",
    data: groups.map((group) => toPublicGroup(group, req.user._id)),
  });
});

const createGroup = asyncHandler(async (req, res) => {
  const { name, description = "", interest } = req.body;

  const group = await Group.create({
    name,
    description,
    interest,
    createdBy: req.user._id,
    members: [req.user._id],
  });

  const populatedGroup = await Group.findById(group._id)
    .populate("createdBy", "anonymousId")
    .populate("members", "anonymousId");

  res.status(201).json({
    message: "Group created.",
    data: toPublicGroup(populatedGroup, req.user._id),
  });
});

const joinGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

  if (!group) {
    throw new AppError("Group not found.", 404);
  }

  if (!group.members.some((memberId) => String(memberId) === String(req.user._id))) {
    group.members.push(req.user._id);
    await group.save();
  }

  const populatedGroup = await Group.findById(group._id)
    .populate("createdBy", "anonymousId")
    .populate("members", "anonymousId");

  res.json({
    message: "Group joined.",
    data: toPublicGroup(populatedGroup, req.user._id),
  });
});

const listGroupMessages = asyncHandler(async (req, res) => {
  await getGroupForMember(req.params.id, req.user._id);

  const messages = await GroupMessage.find({ groupId: req.params.id })
    .populate("authorId", "anonymousId")
    .sort({ createdAt: 1 })
    .limit(100);

  res.json({
    message: "Group messages fetched.",
    data: messages.map(toPublicMessage),
  });
});

const createGroupMessage = asyncHandler(async (req, res) => {
  await getGroupForMember(req.params.id, req.user._id);

  const created = await GroupMessage.create({
    groupId: req.params.id,
    authorId: req.user._id,
    message: req.body.message,
  });

  const populatedMessage = await GroupMessage.findById(created._id).populate("authorId", "anonymousId");

  res.status(201).json({
    message: "Group message sent.",
    data: toPublicMessage(populatedMessage),
  });
});

module.exports = {
  listGroups,
  createGroup,
  joinGroup,
  listGroupMessages,
  createGroupMessage,
};
