const mongoose = require("mongoose");
const moment = require("moment");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  questionId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Question",
    required: false, // only needed for certain notification types
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer", // ✅ Assuming you have an Answer model
    required: false, // only needed for certain notification types
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field for relative time
notificationSchema.virtual("relativeTime").get(function () {
  return moment(this.createdAt).fromNow(); // e.g., "2 hours ago"
});

// Make virtuals included in JSON
notificationSchema.set("toJSON", { virtuals: true });
notificationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Notification", notificationSchema);
