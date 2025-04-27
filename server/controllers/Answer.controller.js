const Question = require("../models/Question.model");
const Answer = require("../models/Answer.model");
const User = require("../models/User.model");
const { updateUserReputation } = require("../utils/reputationUpdate");
const Comment = require("../models/Comments.model");
const Notification = require("../models/Notification.model");

exports.createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const userId = req.user.id;

    if (!questionId || !content) {
      return res.status(400).json({
        success: false,
        message: "Question ID and content are required",
      });
    }

    const question = await Question.findById(questionId).populate("answers");
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Prevent the question owner from answering their own question
    if (question.user.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot answer your own question.",
      });
    }

    // Check if the user has already answered the question
    const userAlreadyAnswered = await Answer.findOne({
      question: questionId,
      user: userId,
    });
    if (userAlreadyAnswered) {
      return res.status(400).json({
        success: false,
        message: "You have already answered this question.",
      });
    }

    // Create a new answer with isApproved set to false
    const answer = new Answer({
      content,
      user: userId,
      question: questionId,
      isApproved: false,
    });
    await answer.save();

    // Add answer reference to the Question
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id },
    });

    // Add answer reference to the User
    await User.findByIdAndUpdate(userId, { $push: { answers: answer._id } });

    // ✅ Create a notification for the question owner including the answer ID
    await Notification.create({
      user: question.user,
      type: "New Answer Request",
      questionId: question._id,
      message: `You have a new answer submission for your question "${question.title}". Please review it.`,
      answer: answer._id, // << added here
    });

    return res.status(201).json({
      success: true,
      message:
        "Answer submitted successfully and is pending approval from the question owner.",
      answer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.approveAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { decision } = req.body; // decision should be "approve" or "decline"
    const userId = req.user.id;

    // Validate decision input
    if (!["approve", "decline"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Invalid decision. Use 'approve' or 'decline'.",
      });
    }

    // Find the answer and populate its associated question
    const answer = await Answer.findById(answerId).populate("question");
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Ensure the logged-in user is the question owner
    if (answer.question.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the question owner can review answers",
      });
    }

    if (decision === "approve") {
      // Check if already approved
      if (answer.isApproved) {
        return res.status(400).json({
          success: false,
          message: "Answer has already been approved",
        });
      }

      // Approve the answer
      answer.isApproved = true;
      await answer.save();

      // Update reputation after approval
      await updateUserReputation(answer.user, "answerAccepted"); // +15
      await updateUserReputation(answer.question.user, "newAnswer"); // +1

      // ✅ Notify the answer owner with answer ID
      await Notification.create({
        user: answer.user,
        type: "Answer Approved",
        message: `Your answer to the question "${answer.question.title}" has been approved.`,
        answer: answer._id, // included here
      });

      return res.status(200).json({
        success: true,
        message: "Answer approved successfully",
        answer,
      });
    } else if (decision === "decline") {
      // Remove answer references from the Question collection
      await Question.findByIdAndUpdate(answer.question._id, {
        $pull: { answers: answer._id },
      });

      // Remove answer references from the User collection
      await User.findByIdAndUpdate(answer.user, {
        $pull: { answers: answer._id },
      });

      // Delete the answer from the database
      await Answer.findByIdAndDelete(answer._id);

      // Notify the answer owner without answer ID
      await Notification.create({
        user: answer.user,
        type: "Answer Declined",
        message: `Your answer to the question "${answer.question.title}" has been declined by the question owner.`,
      });

      return res.status(200).json({
        success: true,
        message:
          "Answer declined and deleted successfully. The answer owner has been notified.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllPendingAnswersForUser = async (req, res) => {
  try {
    // Step 1: Find all answers with isApproved false and populate question
    const pendingAnswers = await Answer.find({ isApproved: false })
    .populate({
      path: 'question',
      select: 'user', // select only user field from Question
    })
    .populate({
      path: 'user',
      select: 'image fullName', // select only image and fullName from User
    });
  
    
     console.log(req.user.id);

    // Step 2: Filter answers where question.userId matches logged-in user's id
    const userPendingAnswers = pendingAnswers.filter((answer) => {
      return answer.question?.user?.toString() === req.user.id;
    });

    // Step 3: Return response
    return res.status(200).json({
      success: true,
      message: "Pending answers fetched successfully",
      data: userPendingAnswers,
    });
  } catch (error) {
    console.error("Error in getAllPendingAnswersForUser:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching pending answers",
    });
  }
};

exports.editAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Assuming authentication middleware

    // Validate content
    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Answer content cannot be empty" });
    }

    // Find the answer
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    // Check if the logged-in user is the owner of the answer
    if (answer.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own answers",
      });
    }

    // Update answer content
    answer.content = content;
    answer.updatedAt = Date.now();
    await answer.save();

    return res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      answer,
    });
  } catch (error) {
    console.error("Error editing answer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const userId = req.user.id; // Authenticated user ID

    // Find the answer
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    // Find the question related to this answer
    const question = await Question.findById(answer.question);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Related question not found" });
    }

    // Check if the user is either the **answer owner** or **question owner**
    if (
      answer.user.toString() !== userId &&
      question.user.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this answer",
      });
    }

    // Handle reputation updates
    await updateUserReputation(answer.user, "answerDeleted"); // Answer owner loses -15
    await updateUserReputation(question.user, "answerRemovedFromQuestion"); // Question owner loses -1

    // Handle upvote reputation rollback
    if (answer.upvotes.length > 0) {
      for (const upvoterId of answer.upvotes) {
        await updateUserReputation(upvoterId, "removeUpvote"); // Upvoters get back +10 each
      }
    }

    // Delete all comments on this answer
    await Comment.deleteMany({ answer: answerId });

    // Remove the answer from the question's answers array
    await Question.findByIdAndUpdate(question._id, {
      $pull: { answers: answerId },
    });

    // Remove the answer from the user's answers array
    await User.findByIdAndUpdate(answer.user, { $pull: { answers: answerId } });

    // Delete the answer
    await Answer.findByIdAndDelete(answerId);

    return res
      .status(200)
      .json({ success: true, message: "Answer deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.voteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { voteType } = req.body; // "upvote" or "downvote"
    const userId = req.user.id; // Authenticated user

    // Find the answer
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res
        .status(404)
        .json({ success: false, message: "Answer not found" });
    }

    // Ensure user is not voting on their own answer
    if (answer.user.toString() === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot vote on your own answer",
      });
    }

    let reputationChange = null;

    // Upvote logic
    if (voteType === "upvote") {
      if (answer.upvotes.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You have already upvoted this answer",
        });
      }

      // If user had previously downvoted, remove downvote first
      if (answer.downvotes.includes(userId)) {
        answer.downvotes = answer.downvotes.filter(
          (id) => id.toString() !== userId
        );
        await updateUserReputation(answer.user, "downvote"); // Reverse downvote penalty
      }

      answer.upvotes.push(userId);
      reputationChange = "upvote";
    }
    // Downvote logic
    else if (voteType === "downvote") {
      if (answer.downvotes.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You have already downvoted this answer",
        });
      }

      // If user had previously upvoted, remove upvote first
      if (answer.upvotes.includes(userId)) {
        answer.upvotes = answer.upvotes.filter(
          (id) => id.toString() !== userId
        );
        await updateUserReputation(answer.user, "removeUpvote"); // Remove upvote reward
      }

      answer.downvotes.push(userId);
      reputationChange = "downvote";
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vote type" });
    }

    await answer.save();

    // Update reputation only if a valid vote action occurred
    if (reputationChange) {
      await updateUserReputation(answer.user, reputationChange);
    }

    return res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
