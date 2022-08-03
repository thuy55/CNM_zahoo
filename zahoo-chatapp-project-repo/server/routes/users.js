const router = require("express").Router();
const userCrl = require("../controller/userCrl");
const User = require("../models/User");

router.put("/change-password/:id", userCrl.changePassword);

router.post("/admin/isActiveUser/:id", userCrl.isActiveUser);
router.get("/", userCrl.getAll);

// GET ONE
router.get("/:id", userCrl.getUserById);

// GET ONE BY PHONE NUMBER
router.get("/phone/:phoneNumber", userCrl.getUserByPhoneNumber);

// SEND REQUEST ADD FRIEND
router.post("/request-add-friend/:id", userCrl.sendRequestAddFriend);

// ACCEPT REQUEST ADD FRIEND
router.post("/accept-add-friend/:id", userCrl.acceptAddFriend);

// Cancel REQUEST ADD FRIEND (thằng gửi nó hủy yêu cầu)
router.post("/cancel-add-friend/:id", userCrl.cancelRequestAddFriend);

// Denied REQUEST ADD FRIEND (thằng nhận nó hủy yêu cầu)
router.post("/denied-add-friend/:id", userCrl.deniedRequestAddFriend);

// SUGGESSTION FRIENDS
router.post("/suggestions-friend", userCrl.suggestionsFriend);

// UNFRIEND
router.post("/unfriend/:id", userCrl.unFriend);

// GET USER BY CONTACTS 
router.post("/contacts", userCrl.getListUserByContact);  
router.post("/edit-infor/:id", userCrl.editInfo);  

// // UPDATE
// router.put("/:id", async (req,res) => {
//     if(req.body.userId === req.params.id  || req.body.isAdmin){
//         if(req.body.password){
//             try {
//                 const salt = await bcrypt.genSalt(saltRounds)
//                 req.body.password = await bcrypt.hash(req.body.password, salt)

//             } catch (err) {
//                 return res.status(500).json({msg:err.message})
//             }
//         }
//         try {
//             const user = await User.findByIdAndUpdate(req.params.id, {
//                 $set: req.body,
//             })
//             res.status(200).json("Account has been updated")
//         } catch (err) {
//             return res.status(500).json({msg:err.message})
//         }

//     } else {
//         return res.status(403).json("You can update only your account")
//     }
// })
// // DELETE
// router.delete("/:id", async (req,res) => {
//     if(req.body.userId === req.params.id  || req.body.isAdmin){
//         try {
//             const user = await User.deleteOne({_id: req.params.id})
//             res.status(200).json("Account has been deleted")
//         } catch (err) {
//             return res.status(500).json({msg:err.message})
//         }

//     } else {
//         return res.status(403).json("You can delete only your account")
//     }
// })
module.exports = router;
