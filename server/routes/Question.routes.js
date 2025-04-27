const express = require("express");
const router = express.Router();

const {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  getAllQuestions,
  getQuestionById,
  getQuestionsByUser,
  getQuestionsByTag,
  getQuestionByTitle,
  voteQuestion,
  getAllQuestionsSortedByUpvotes,
  getQuestionByIdForPendingAnswers,
  getQuestions,
  getQuestionSuggestions,
  askQuestionToAI,
  generateTags,
} = require("../controllers/Question.controller");

const { auth } = require("../middlewares/Auth.middleware");

router.post("/createQuestion", auth, createQuestion);
router.get("/getQuestionByIdForPendingAnswers/:questionId",getQuestionByIdForPendingAnswers);
router.delete("/deleteQuestion/:questionId", auth, deleteQuestion);
router.put("/updateQuestion/:questionId", auth, updateQuestion);
router.get("/getAllQuestions", getAllQuestions);
router.get("/getQuestionById/:questionId", getQuestionById);
router.get("/getUserQuestions/:userId", getQuestionsByUser);
router.get("/getQuestionsByTag/:tag", getQuestionsByTag);
router.get("/getQuestionsByTitle/:title", getQuestionByTitle);
router.put("/voteQuestion/:questionId", auth, voteQuestion);
router.get("/getTopQuestions", getAllQuestionsSortedByUpvotes);
router.get("/getQuestions", getQuestions);
router.post("/questions-suggestions", getQuestionSuggestions);
router.post("/askAI",askQuestionToAI);
router.post("/generateTags", generateTags);
module.exports = router;
