const User = require("../models/User.model");
const Question = require("../models/Question.model");
const Answer = require("../models/Answer.model");
const Comment = require("../models/Comments.model");
const bcrypt = require("bcryptjs");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const {uploadImageToCloudinary} =require("../utils/imageUploader");

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and exclude sensitive fields
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch all questions asked by the user
    const questions = await Question.find({ user: userId })
      .populate({
        path: "answers",
        populate: { path: "comments", model: "Comment" }, // Populate comments on answers
      })
      .populate("comments"); // Populate comments on questions

    // Fetch all answers given by the user along with their corresponding questions
    const answers = await Answer.find({ user: userId }).populate("question");

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user,
      questions,
      answers,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete all questions asked by the user
    await Question.deleteMany({ user: userId });

    // Delete all answers written by the user
    await Answer.deleteMany({ user: userId });

    // Delete all comments made by the user
    await Comment.deleteMany({ user: userId });

    // Remove the user from the database
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User account and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getTopUsersByReputation = async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ reputation: -1 }) // Sort users by highest reputation
      .select("name reputation") // Select only necessary fields
      .limit(10); // Limit to top 10 users (adjust as needed)

    res.status(200).json({
      success: true,
      message: "Top users retrieved successfully based on reputation",
      topUsers,
    });
  } catch (error) {
    console.error("Error fetching top users by reputation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from auth middleware
    const { fullName, about } = req.body;

    // Find user by ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update only the allowed fields
    if (fullName) user.fullName = fullName;
    if (about) user.about = about;
    user.updatedAt = Date.now(); // Update timestamp

    // Save changes
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The current password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.fullName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    console.log(req.files);
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      800,
      80
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}





