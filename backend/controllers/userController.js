const User = require("../models/User.js");
const Connection = require("../models/Connection.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary.js");
/* GET MY PROFILE */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PROFILE */
const updateProfile = async (req, res) => {
  try {
    const { bio, location, email, profession, socialLinks } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user,
      { bio, location, email, profession, socialLinks },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PASSWORD */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user);

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
  
    
    const userId = req.user;

    if (!req.file) {
    
      return res.status(400).json({ message: "Image file is required" });
    }

   
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: req.file.path },
      { new: true }
    ).select("-password");

    if (!user) {
      
      return res.status(404).json({ message: "User not found" });
    }

   

    res.json({
      success: true,
      message: "Profile image updated successfully",
      imageUrl: req.file.path,
      user,
    });
  } catch (error) {
    
    res.status(500).json({ 
      message: "Failed to update profile image",
      error: error.message 
    });
  }
};

// controllers/userController.js


const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user; // JWT middleware se aata hai

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Cloudinary image delete yaha kar sakte ho

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kisi bhi user ki profile ID ke through dekhne ke liye


const getPublicProfile = async (req, res) => {
  try {
    
    const { id } = req.params;

    
    const user = await User.findById(id).select("-password -email");

    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "No User found with this ID" 
      });
    }

    res.status(200).json(user);

  } catch (error) {
    
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    res.status(500).json({ message: "Server mein kuch gadbad hai bhai!" });
  }
};

const  profileImageRemove = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user || !user.profileImage) {
      return res.status(400).json({
        success: false,
        message: "No profile image to delete"
      });
    }


    const imageUrl = user.profileImage;
    const publicId = imageUrl.split("/").pop().split(".")[0];

    
    await cloudinary.uploader.destroy(`profile-images/${publicId}`);

    
    user.profileImage = "";
    await user.save();

    res.json({
      success: true,
      message: "Profile image removed successfully"
    });

  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to delete profile image"
    });
  }
};

/* FOLLOW USER */
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingConnection = await Connection.findOne({
      follower: currentUserId,
      following: userId,
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Already connected with this user" });
    }

    const connection = new Connection({
      follower: currentUserId,
      following: userId,
      status: "connected",
    });

    await connection.save();

    res.status(201).json({
      success: true,
      message: "User followed successfully",
      connection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UNFOLLOW USER */
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user;

    const connection = await Connection.findOneAndDelete({
      follower: currentUserId,
      following: userId,
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    res.json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* BLOCK USER */
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let connection = await Connection.findOne({
      follower: currentUserId,
      following: userId,
    });

    if (connection) {
      connection.status = "blocked";
      await connection.save();
    } else {
      connection = new Connection({
        follower: currentUserId,
        following: userId,
        status: "blocked",
      });
      await connection.save();
    }

    // Emit socket event to notify the blocked user
    if (req.io) {
      req.io.to(userId.toString()).emit('userBlockedMe', {
        blockedBy: currentUserId,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: "User blocked successfully",
      connection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET CONNECTION STATUS */
const getConnectionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user;

    const connection = await Connection.findOne({
      follower: currentUserId,
      following: userId,
    });

    if (!connection) {
      return res.json({
        success: true,
        connected: false,
        status: null,
      });
    }

    res.json({
      success: true,
      connected: true,
      status: connection.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* GET MY CONNECTIONS */
const getMyConnections = async (req, res) => {
  try {
    const currentUserId = req.user;

    const connections = await Connection.find({
      follower: currentUserId,
      status: "connected",
    }).populate('following', 'name profileImage email bio profession');

    const connectedUsers = connections.map(conn => ({
      ...conn.following.toObject ? conn.following.toObject() : conn.following,
      connectionId: conn._id,
      connectedAt: conn.createdAt
    }));

    res.json({
      success: true,
      count: connectedUsers.length,
      connections: connectedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET BLOCKED USERS */
const getBlockedUsers = async (req, res) => {
  try {
    const currentUserId = req.user;

    const blockedConnections = await Connection.find({
      follower: currentUserId,
      status: "blocked",
    }).populate('following', 'name profileImage email');

    const blockedUsers = blockedConnections.map(conn => ({
      ...conn.following.toObject ? conn.following.toObject() : conn.following,
      connectionId: conn._id,
      blockedAt: conn.createdAt
    }));

    res.json({
      success: true,
      count: blockedUsers.length,
      blockedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UNBLOCK USER */
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user;

    const connection = await Connection.findOne({
      follower: currentUserId,
      following: userId,
      status: "blocked",
    });

    if (!connection) {
      return res.status(404).json({ message: "User not found in blocked list" });
    }

    await Connection.deleteOne({
      follower: currentUserId,
      following: userId,
    });

    // Emit socket event to notify the unblocked user
    if (req.io) {
      req.io.to(userId.toString()).emit('userUnblockedMe', {
        unblockedBy: currentUserId,
        timestamp: new Date()
      });
    }

    // Emit to current user that unblock happened (for Explore refresh)
    if (req.io) {
      req.io.to(currentUserId.toString()).emit('userUnblocked', {
        userId: userId,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getMyProfile,
  updateProfile,
  updatePassword,
  updateProfileImage,
  deleteMyAccount ,
  getPublicProfile,
  profileImageRemove,
  followUser,
  unfollowUser,
  blockUser,
  getConnectionStatus,
  getMyConnections,
  getBlockedUsers,
  unblockUser
};
