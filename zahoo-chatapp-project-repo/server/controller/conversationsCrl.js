const Mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const conversationsCrl = {
  postConversation: async (req, res) => {
      const newConversation = new Conversation({
        label: req.body.label,
        member: req.body.array,
        createdBy: req.body.createdBy
      });
       
    
    try {
      const savedConversation = await newConversation.save();
      const conversation = await Conversation.findById({
        _id: savedConversation._id,
      })
        .select("-updatedAt")
        .populate("member", "profilePicture username")
        .populate("lastMessage", "text updatedAt")
        .populate("createdBy", " _id username")
      
       
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },

  getConversationByUserId: async (req, res) => {
    try {
      const conversations = await Conversation.find({
        member: { $in: [req.params.userId] },
      })
        .select("-updatedAt")
        // .limit(10)
        .populate("member", "profilePicture username")
        .populate("lastMessage", "text updatedAt")
        .populate("createdBy", "_id username")
        
        .sort("-lastMessage");
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },
  getConversationWithFriend: async (req, res) => {
    try {
      const conversation = await Conversation.find({
        $and: [
          { member: { $size: 2 } },
          { member: { $all: [req.params.friendId, req.body.userId] } },
        ],
      })
        .select("-updatedAt")
        .populate("member", "profilePicture username")
        .populate("lastMessage", "text updatedAt");
      res.status(200).json(conversation[0]);
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },
  updateLastMsg: async (req, res) => {
    const msgId = req.body.lastMsgId;
    try {
      const conversation = await Conversation.findOneAndUpdate(
        { _id: req.params.conversationId },
        { lastMessage: msgId }
      )
        .select("-updatedAt")
        .populate("member", "profilePicture username");
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },
  getImageAndVideo: async (req, res) => {
    const media = await Message.aggregate([
      {
        $match: {
          conversation: Mongoose.Types.ObjectId(req.params.conversationId),
        },
      },
      { $match: { media: { $exists: true, $not: { $size: 0 } } } },
      { $project: { media: "$media" } },
      { $unwind: "$media" },
      {
        $match: {
          "media.type": { $in: [/^image/i, /^video/] },
        },
      },
    ]);

    try {
      res.status(200).json({ media });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },
  getFiles: async (req, res) => {
    const media = await Message.aggregate([
      {
        $match: {
          conversation: Mongoose.Types.ObjectId(req.params.conversationId),
        },
      },
      { $match: { media: { $exists: true, $not: { $size: 0 } } } },
      { $project: { media: "$media" } },
      { $unwind: "$media" },
      {
        $match: {
          "media.type": /^application/i,
        },
      },
    ]);

    try {
      res.status(200).json({ media });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },
  search: async (req, res) => {
    const keyword = req.params.keyword;
    const userId = req.user.id;
    try {
      // input => keyword, userId
      const conversations = await Conversation.aggregate([
        // {$unwind:"$member"},
        {
          $lookup: {
            from: "users",
            as: "user",
            let: { user_id: "$member" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
              { $project: { username: 1, profilePicture: 1 } },
            ],
          },
        },
        // { $unwind:"$user"},
        // { $match: { $expr: {$eq: ["$user._id", mongoose.Types.ObjectId(userId)]} } },
      ]);
      res.status(200).json({ conversations });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },
  changeLabel: async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.params.id);
      if (conversation.label !== undefined) {
        await Conversation.findByIdAndUpdate(
          { _id: req.params.id },
          {
            label: req.body.newLabel,
          },
          { new: true }
        );
      }

      res.status(200).json(await Conversation.findById(req.params.id));
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },

  addMemberGroup: async (req, res) => {
    const {conversationId} = req.params;
    const newMember = req.body.member
    try {
      const c = await Conversation.findById(conversationId);
      console.log("tesst:", c)
      const m = c.member;
      newMember.forEach(item => {
        if(!c.member.includes(item))
        m.push(item);
      })
      const conversation = await Conversation.findByIdAndUpdate(
        { _id: conversationId },
        {
          member: m,
        },
        { new: true }
      );
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },

  deleteGroup: async (req, res) => {
    const conversationId = req.params.id;

    try {
      const user = req.body.userId;

      const c = await Conversation.findById({ _id: conversationId });
      if (c.createdBy == user) {
        await Conversation.findByIdAndDelete({ _id: conversationId });

        res.status(200).json({ msg: "Xóa nhóm chat thành công!" });
      } else {
        res
          .status(500)
          .json({ msg: "Chỉ có admin mới có quyền xóa nhóm chat" });
      }
    } catch (error) {
      res.status(500).json({ errorMessage: error });
    }
  },
  deleteMember: async (req, res) => {
      const {memberId}= req.params
     
    try {
      const {conversationId, userId}  = req.body
    const c = await Conversation.findById(conversationId);

      if (c.createdBy == userId) {

        const m=c.member.pull(memberId)

        const conversation = await Conversation.findByIdAndUpdate(
          { _id: req.body.conversationId },
          {
            member: m,
          },
          { new: true }
        );
        res.status(200).json(conversation);

      }
       else {
        return   res
          .status(500)
          .json({ msg: "Chỉ có admin mới có quyền xóa thành viên" });
      }
    } catch (error) {
     return  res.status(500).json({ errorMessage: error });
    }
  },

//roi nhom
  outGroup: async (req, res) => {
    const {id}= req.params
   
  try {
    const {userId}  = req.body
  const c = await Conversation.findById(id);
      const m=c.member.pull(userId)

      const conversation = await Conversation.findByIdAndUpdate(
        { _id: id },
        {
          member: m,
        },
        { new: true }
      );
      res.status(200).json(conversation);
    }
 catch (error) {
   return  res.status(500).json({ errorMessage: error });
  }
},
};
module.exports = conversationsCrl;
