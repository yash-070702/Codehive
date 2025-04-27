const Question = require("../models/Question.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const User = require("../models/User.model");
const Comment = require("../models/Comments.model");
const Answer = require("../models/Answer.model");
const { updateUserReputation } = require("../utils/reputationUpdate");
const { spawn } =require("child_process");

const axios = require("axios");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.createQuestion = async (req, res) => {
  try {
    const { title, description, tried, tags } = req.body;
    const userId = req.user.id;

    if (!title || !description || !tags || tags.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const question = new Question({
      title,
      description,
      tried, // Store what the user has tried
      tags,
      user: userId,
      updatedAt: Date.now(),
    });

    await question.save();

    // Add question reference to User model
    await User.findByIdAndUpdate(userId, {
      $push: { questions: question._id },
    });

    // Update user reputation for posting a new question
    await updateUserReputation(userId, "newQuestion");

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id; 

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Ensure only the owner can delete
    if (question.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this question",
      });
    }

    // Find all answers to this question
    const answers = await Answer.find({ question: questionId });

    // Adjust reputation for users who answered
    for (const answer of answers) {
      const answerOwner = answer.user;

      // Deduct reputation for answer upvotes
      const upvoteLoss = answer.upvotes.length * 10;

      // Deduct reputation for accepted answers
      const acceptedAnswerLoss = answer.isAccepted ? 15 : 0;

      const totalLoss = upvoteLoss + acceptedAnswerLoss;

      if (totalLoss > 0) {
        await updateUserReputation(answerOwner, -totalLoss);
      }
    }

    // Get all answer IDs
    const answerIds = answers.map((ans) => ans._id);

    // Delete comments related to the question and its answers
    await Comment.deleteMany({
      $or: [{ question: questionId }, { answer: { $in: answerIds } }],
    });

    // Delete all answers for this question
    await Answer.deleteMany({ question: questionId });

    // Remove question reference from the user's profile
    await User.findByIdAndUpdate(userId, { $pull: { questions: questionId } });

    // Delete the question itself
    await Question.findByIdAndDelete(questionId);

    // Deduct reputation for deleting a question (-2 points)
    await updateUserReputation(userId, "questionDeleted");

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully. Reputation updated.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description, tags } = req.body;
    const userId = req.user.id; // Assuming authentication middleware

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Ensure only the owner can update
    if (question.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this question",
      });
    }

    // Use findByIdAndUpdate to update the existing document
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { title, description, tags, updatedAt: Date.now() }, // Updating fields
      { new: true } // Returns updated document instead of old one
    );

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "newest";
    const skip = (page - 1) * limit;

    let sortCriteria = {};
    if (sortBy === "newest") {
      sortCriteria = { createdAt: -1 };
    } else if (sortBy === "topVote") {
      sortCriteria = { upvotes: -1 };
    }

    // Fetch questions with sorting and pagination
    const questions = await Question.find()
      .populate("user", "fullName userName image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalQuestions = await Question.countDocuments();

    return res.status(200).json({
      success: true,
      totalQuestions,
      totalPages: Math.ceil(totalQuestions / limit),
      currentPage: page,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .sort({ createdAt: -1 }) // Sort by upvotes in descending order
      .populate("user", "fullName userName image") // Corrected: fullName instead of name
      .populate({
        path: "answers",
        match: { IsApproved: true },
        select: "content upvotes",
        populate: {
          path: "user",
          select: "fullName userName image",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully",
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Find the question and populate user and answers
    const question = await Question.findById(questionId)
      .populate("user", "fullName userName image") // Populate user details
      .populate({
        path: "answers",
        match: { isApproved: true },
        populate: {
          path: "user",
          select: "fullName userName image",
        },
      })
      .exec();

    // If question not found
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    return res.status(200).json({ success: true, question });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
exports.getQuestionByIdForPendingAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Find the question and populate user and answers
    const question = await Question.findById(questionId)
      .populate("user", "fullName userName image") // Populate user details
      .populate({
        path: "answers",
        match: { isApproved:false},
        populate: {
          path: "user",
          select: "fullName userName image",
        },
      })
      .exec();

    // If question not found
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    return res.status(200).json({ success: true, question });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getQuestionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch all questions posted by this user and populate answers and user details
    const questions = await Question.find({ user: userId })
      .populate({
        path: "user",
        select: "fullName userName image ", // Populating only fullName and userName
      })
      .populate({
        path: "answers",
        match: { approved: true },
        populate: {
          path: "user",
          select: "fullName userName",
        },
      });

    return res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getQuestionsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    // Find all questions that contain the specified tag
    const questions = await Question.find({ tags: tag })
      .populate("user", "fullName")
      .populate({
        path: "answers",
        match: { approved: true },
      })
      
      .populate("comments")
      .sort({ createdAt: -1 })
      .exec();

    if (!questions.length) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found for this tag" });
    }

    return res.status(200).json({
      success: true,
      message: `Questions fetched successfully for tag: ${tag}`,
      questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getQuestionByTitle = async (req, res) => {
  try {
    const { title } = req.params;

    // Use a case-insensitive search to find the question by title
    const question = await Question.findOne({
      title: { $regex: new RegExp(title, "i") },
    })
      .populate("user", "fullName")
      .populate({
        path: "answers",
        match: { approved: true },
      })
      
      .populate("comments")
      .exec();

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "No question found with this title" });
    }

    return res.status(200).json({
      success: true,
      message: "Question fetched successfully",
      question,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.voteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { voteType } = req.body; // "upvote" or "downvote"
    const userId = req.user.id; // Assuming authentication middleware

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    // Ensure user is not the owner of the question
    if (question.user.toString() === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot vote on your own question",
      });
    }

    let reputationAction = null;

    // Upvote logic
    if (voteType === "upvote") {
      if (question.upvotes.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You have already upvoted this question",
        });
      }

      // Remove downvote if exists and add upvote
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== userId
      );
      question.upvotes.push(userId);
      reputationAction = "upvote"; // Increase question owner's reputation
    }
    // Downvote logic
    else if (voteType === "downvote") {
      if (question.downvotes.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "You have already downvoted this question",
        });
      }

      // Remove upvote if exists and add downvote
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== userId
      );
      question.downvotes.push(userId);
      reputationAction = "downvote"; // Decrease question owner's reputation
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vote type" });
    }

    await question.save();

    // Update reputation for the question owner
    if (reputationAction) {
      await updateUserReputation(question.user, reputationAction);
    }

    return res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
      upvotes: question.upvotes.length,
      downvotes: question.downvotes.length,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getAllQuestionsSortedByUpvotes = async (req, res) => {
  try {
    const questions = await Question.find({})
      .sort({ upvotes: -1 }) // Sort by upvotes in descending order
      .populate("user", "fullName userName image") // Corrected: fullName instead of name
      .populate({
        path: "answers",
        select: "content upvotes",
        populate: {
          path: "user",
          select: "fullName userName image", // Populate user details for answers as well
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully",
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// AI-powered question suggestion function
exports.getQuestionSuggestions = async (req, res) => {
  try {
    const { description } = req.body; // Get description from request body

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Suggest three similar programming-related questions based on: "${description}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.json({ suggestions: response.split("\n") });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Failed to generate suggestions" });
  }
};

exports.askQuestionToAI = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "Question is required" });

    // Gemini API request
    const response = await axios.post(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: question }] }],
      }
    );

    const aiResponse =
      response.data.candidates[0]?.content?.parts[0]?.text ||
      "Sorry, I couldn't generate an answer.";
    res.status(200).json({
      success: true,
      answer: aiResponse });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.generateTags=async(req,res)=>{
  const { description } = req.body;

    if (!description) {
        return res.status(400).json({ error: "Text input is required" });
    }

    const pythonProcess = spawn("python", ["utils/tagGenerator.py", description]);

    let tags = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
        tags += data.toString().trim();
    });

    pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            console.error(`Python script error: ${errorOutput}`);
            return res.status(500).json({ error: "Python script failed to execute" });
        }

        if (!tags) {
            return res.status(500).json({ error: "No output from Python script" });
        }

        try {
            const parsedTags = JSON.parse(tags);
            if (parsedTags.error) {
                return res.status(500).json({ error: parsedTags.error });
            }
            res.json(parsedTags);
        } catch (error) {
            console.error("Error parsing JSON output:", error);
            res.status(500).json({ error: "Invalid JSON format from Python script" });
        }
    });
};