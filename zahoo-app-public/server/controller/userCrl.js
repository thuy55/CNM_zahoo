const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
const userCrl = {
  getAll: async (req, res) => {
    try {
      const features = new APIfeatures(
        User.find({ _id: { $exists: true } }),
        req.query
      ).paginating();
      const users = await features.query
        // .select('id gender username phoneNumber createdAt')
        .select(
          "profilePicture gender isAdmin username phoneNumber createdAt status"
        )
        .sort("-createdAt");
      res.status(200).json({
        data: users,
        page: parseInt(req.query.page),
        result: users.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getListUserSendRequestAddFriendOfMe: async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId);
      const users = await User.find({
        friendsQueue: { $in: [userId] },
      }).select("username profilePicture phoneNumber");

      res.status(200).json({
        data: users,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await User.findById({ _id: req.params.id });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  isActiveUser: async (req, res) => {
    try {
      const admin = await User.findById({ _id: req.body.userId });

      const user = await User.findById(req.params.id);
      // console.log("aaaaaaaaaa", user._doc.status);
      if (admin._doc.isAdmin) {
        const userUpdate = await User.findByIdAndUpdate(
          req.params.id,
          {
            status: !user._doc.status,
          },
          { new: true }
        );
        res
          .status(200)
          .json({ msg: "Update status success", user: userUpdate });
      }
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  },
  getUserByPhoneNumber: async (req, res) => {
    try {
      const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      return res.status(500).json({ msg: "Không tồn tại!" });
    }
  },
  getListUserByContact: async (req, res) => {
    try {
      const contacts = req.body.contacts;

      const getUser = async () => {
        let users = [];

        for (let i = 0; i < contacts.length; i++) {
          users.push(
            await User.findOne({
              phoneNumber: contacts[i].split(" ").join(""),
            }).select("-password -updatedAt -createdAt")
          );
        }

        return users.filter((user) => user != null);
      };

      res.status(200).json(await getUser());
    } catch (err) {
      return res.status(500).json({ msg: "Không tồn tại!" });
    }
  },
  sendRequestAddFriend: async (req, res) => {
    try {
      const idcuaMinh = req.body.userId;
      const thangNhan = await User.findById({ _id: req.params.id });
      if (thangNhan._doc.friendsQueue.includes(idcuaMinh)) {
        return res.status(400).json({ msg: "Bạn đã gửi yêu cầu kết bạn rồi" });
      }
      thangNhan._doc.friendsQueue.push(idcuaMinh);

      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: thangNhan._doc,
      });
      res.status(200).json({ msg: "Gửi yêu cầu kết bạn thành công!" });
    } catch (err) {
      return res.status(500).json({ err });
    }
  },
  acceptAddFriend: async (req, res) => {
    const userId = req.body.userId;
    const friendId = req.params.id;
    try {
      const user = await User.findById(userId);

      const friends = user._doc.friends.push(friendId);
      const friendsQueue = user._doc.friendsQueue.pull(friendId);

      const userUpdate = await User.findOneAndUpdate(
        { _id: userId },
        { $set: user }
        // function (err, docs) {
        //   err &&  res.status(500).json({msg:err.message});
        // }
      );

      const nguoiGui = await User.findById(friendId);
      nguoiGui._doc.friends.push(userId);
      nguoiGui._doc.friendsQueue.pull(userId);

      await User.findOneAndUpdate(
        { _id: friendId },
        { $set: nguoiGui }
        // function (err, docs) {
        //   err &&  res.status(500).json({msg:err.message});
        // }
      );

      res.status(200).json({ nguoiGui, userUpdate });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  cancelRequestAddFriend: async (req, res) => {
    try {
      const nguoiNhan = await User.findById(req.params.id);
      nguoiNhan._doc.friendsQueue.pull(req.body.userId);

      await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: nguoiNhan }
        // { returnOriginal: false },
        // function (err, docs) {
        //   err && res.status(500).json({ nguoiNhan });
        // }
      );

      res.status(200).json({ msg: "Hủy yêu cầu kết bạn thành công!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deniedRequestAddFriend: async (req, res) => {
    try {
      //user là minh nè
      const user = await User.findById(req.body.userId);

      user._doc.friendsQueue.pull(req.params.id);
      const nguoiGui = await User.findById(req.params.id);

      await User.findOneAndUpdate(
        { _id: req.body.userId },

        { $set: user },
        function (err, docs) {
          err && res.status(500).json({ msg: "that bai" });
        }
      );

      res.status(200).json({ nguoiGui });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  suggestionsFriend: async (req, res) => {
    try {
      const user = await User.findById({ _id: req.body.userId });

      const friends_user = user.friends;

      const result = [];
      if (friends_user.length > 0) {
        for (var i = 0; i < friends_user.length; i++) {
          const a = await User.findById({ _id: friends_user[i] });

          a.friends.forEach((a1) => {
            if (
              a1 !== user._id &&
              friends_user.filter((f) => f == a1)[0] == undefined
            ) {
              result.push(a1);
            }
          });
        }

        return res.status(200).json({ result: result });
      } else {
        const list = await User.find();
        if (list.length >= 10) {
          const nlist = list.slice(0, 10);
          nlist.forEach((u, index) => {
            result.push(u._id);
          });

          return res.status(200).json({ result: result });
        } else {
          list.forEach((u, index) => {
            result.push(u._id);
          });
          return res.status(200).json({ result: result });
        }
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unFriend: async (req, res) => {
    try {
      const user = await User.findById({ _id: req.body.userId });
      const friend = await User.findById({ _id: req.params.id });
      user._doc.friends.pull(friend._id);
      friend._doc.friends.pull(user._id);

      const userUpdate = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      const friendUpdate = await User.findOneAndUpdate(
        { _id: friend._id },
        { $set: friend },
        { new: true }
      );

      res.status(200).json(userUpdate);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      let user = await User.findById(req.params.id);

      const newPassword = req.body.newPassword;
      const oldPassword = req.body.oldPassword;

      if (await bcrypt.compare(oldPassword, user.password)) {
        if (newPassword.length < 5) {
          return res
            .status(400)
            .json({ msg: "Mật khẩu phải lớn hơn 5 ký tự." });
        }

        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        user = await User.findByIdAndUpdate(
          req.params.id,
          { password: passwordHash },
          { new: true }
        );
        return res
          .status(200)
          .json({ msg: "Cập nhật mật khẩu thành công", user });
      }

      return res
        .status(400)
        .json({ msg: "Mật khẩu sai, vui lòng kiểm tra lại", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changePhone: async (req, res) => {
    try {
      let user = await User.findById(req.params.id);

      const phoneNumber = req.body.phoneNumber;

      const validPassword = await bcrypt.compare(
        req.body.password.trim(),
        user.password
      );

      if (validPassword) {
        await User.findByIdAndUpdate(
          req.params.id,
          { phoneNumber: phoneNumber },
          { new: true }
        );
        return res
          .status(200)
          .json({ msg: "Cập nhật số điện thoại thành công" });
      }

      return res.status(200).json({ msg: "Cập nhật số điện thoại thất bại" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  editInfo: async (req, res) => {
    try {
      const { newUsername, newProfilePicture, newGender } = req.body;

      const u = await User.findById(req.params.id);
      console.log(u.profilePicture);

      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: newUsername,
            profilePicture: newProfilePicture
              ? newProfilePicture
              : u.profilePicture,
            gender: newGender,
          },
        },
        { new: true }
      );
      res.status(200).json({ msg: "Update infor user success", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = userCrl;
