const  mongoose  = require("mongoose");
const notificationSchema = new mongoose.Schema(
    {

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        type: {
            type: String,
            enum: ["message", "CONNECTION_REQUEST", "CONNECTION_ACCEPTED", "SYSTEM"],
            required: true,
        },


        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },


        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },


        isRead: {
            type: Boolean,
            default: false,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ["low", "normal", "high"],
            default: "normal",
        },


        redirectUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
