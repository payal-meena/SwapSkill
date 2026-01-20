const User = require("../models/User.js");


const roleMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
     
      const userId = req.user;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "User is blocked",
        });
      }

    
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

module.exports = roleMiddleware;
