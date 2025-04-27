import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { questionsEndpoints } from "../apis";

const {
  GET_TOP_QUESTION_API,
  GET_USER_QUESTIONS_API,
  GET_QUESTION_BY_ID_API,
  GET_QUESTION_BY_ID_FOR_PENDING_ANSWERS_API,
  CREATE_QUESTION_API,
  GET_QUESTIONS_API,
  GET_ALL_QUESTIONS_API,
  SUGGEST_QUESTION_API,
  GET_QUESTION_ANSWER_BY_AI_API,
  SUGGEST_TAGS_API,
  VOTE_QUESTION_API,
  DELETE_QUESTION_API,
  UPDATE_QUESTION_API,
} = questionsEndpoints;

export const createQuestion = async (data, token, navigate) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("POST", CREATE_QUESTION_API, data, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    console.log("CREATE QUESTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    toast.success("Question Posted Successfully");
    navigate("/profile");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE QUESTION API ERROR............", error);
    toast.error("Something Went Wrong try Again Later...");
  }
  toast.dismiss(toastId);
  return result;
};
export const voteQuestion = async (questionId, voteType, token) => {
  const toastId = toast.loading("Processing vote...");
  let result = [];
  try {
    const response = await apiConnector(
      "PUT",
      `${VOTE_QUESTION_API}/${questionId}`, // Corrected API endpoint
      { voteType }, // Only send voteType in body
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("VOTE QUESTION API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not cast vote");
    }

    result = response?.data;
    toast.success("Vote recorded successfully");
  } catch (error) {
    console.error("VOTE QUESTION API ERROR:", error);
    toast.error(
      error.response?.data?.message || "Something went wrong. Try again later."
    );
  }
  toast.dismiss(toastId);
  return result;
};

export const editQuestion = async (data, token, questionId,navigate) => {
  let result = null;
  const toastId = toast.loading("Loading...");
console.log(questionId)
  try {
    // Make the API call
    const response = await apiConnector("PUT", `${UPDATE_QUESTION_API}/${questionId}`, data, {
      Authorization: `Bearer ${token}`,
    });

    // Log response for debugging
    console.log("EDIT QUESTION API RESPONSE:", response);

    // Check if the response indicates success
    if (!response?.data?.success) {
      throw new Error("Could not update question right now.");
    }

    // Show success message and store result
    toast.success("question updated successfully.");
    result = response?.data?.data;
    navigate(`/question/${questionId}`);

  } catch (error) {
    // Log error for debugging
    console.log("EDIT   QUESTION API ERROR:", error);

    // Show error message to the user
    toast.error(!true || "An unexpected error occurred.");
  } finally {
    // Dismiss the loading toast
    toast.dismiss(toastId);
  }

  return result;
};

export const getTopQuestions = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_TOP_QUESTION_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Top Questions");
    }
    //   console.log(response);
    result = response?.data;
    console.log("GET_TOP_QUESTION_API API RESPONSE............", result);
  } catch (error) {
    console.log("GET_TOP_QUESTION_API API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getQuestions = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_QUESTIONS_API);

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Top Questions");
    }
    //   console.log(response);
    result = response?.data;
    console.log("GET_QUESTION_API API RESPONSE............", result);
  } catch (error) {
    console.log("GET_QUESTION_API API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getAllQuestions = async (
  page = 1,
  limit = 10,
  sortBy = "newest"
) => {
  const toastId = toast.loading("Fetching questions...");
  let result = { questions: [], totalPages: 1, currentPage: 1 };

  try {
    const response = await apiConnector(
      "GET",
      `${GET_ALL_QUESTIONS_API}?page=${page}&limit=${limit}&sortBy=${sortBy}`
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch newest questions");
    }

    result = {
      questions: response?.data?.questions,
      totalPages: response?.data?.totalPages,
      currentPage: response?.data?.currentPage,
    };
    console.log("Paginated Questions API Response:", result);
  } catch (error) {
    console.log("Error fetching paginated questions:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getUserQuestions = async (userId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      `${GET_USER_QUESTIONS_API}/${userId}`
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Top Questions");
    }
    //   console.log(response);
    result = response?.data;
    console.log("GET_USER_QUESTION_API API RESPONSE............", result);
  } catch (error) {
    console.log("GET_USER_QUESTION_API API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getQuestionById = async (questionId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      `${GET_QUESTION_BY_ID_API}/${questionId}`
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Top Questions");
    }
    //   console.log(response);
    result = response?.data?.question;
    console.log("GET_QUESTION_BY_ID API RESPONSE............", result);
  } catch (error) {
    console.log("GET_QUESTION_BY_ID API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getQuestionByIdPendingAnswers = async (questionId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      `${GET_QUESTION_BY_ID_FOR_PENDING_ANSWERS_API}/${questionId}`
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Pednig nswer to question");
    }
    //   console.log(response);
    result = response?.data?.question;
    console.log("GET_QUESTION_BY_ID_PENDING_ANSWER API RESPONSE............", result);
  } catch (error) {
    console.log("GET_QUESTION_BY_ID_PENDING_ANSWER API API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getQuestionSuggestions = async (description) => {
  try {
    const response = await apiConnector("POST", SUGGEST_QUESTION_API, {
      description,
    });

    if (!response?.data?.suggestions) {
      throw new Error("No suggestions received");
    }

    return response.data.suggestions;
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return [];
  }
};

export const askAI = async (question) => {
  const toastId = toast.loading("Generating answer...");
  let result = "";

  try {
    const response = await apiConnector("POST", GET_QUESTION_ANSWER_BY_AI_API, {
      question,
    });
    console.log(response);

    if (!response?.data?.success) {
      throw new Error("Failed to get AI response");
    }

    result = response?.data?.answer;
    console.log("AI RESPONSE:", result);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    toast.error("Failed to get response. Try again.");
    result = "Failed to get response. Try again.";
  }

  toast.dismiss(toastId);
  return result;
};

export const fetchSuggestedTags = async (description) => {
  if (!description.trim()) return [];

  try {
    const response = await apiConnector("POST", SUGGEST_TAGS_API, {
      description,
    });

    console.log("SUGGESTED TAGS API RESPONSE:", response);
    return response.data.tags || [];
  } catch (error) {
    console.error("Error fetching suggested tags:", error);
    return [];
  }
};

export const deleteQuestion = async (questionId, token,navigate) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", `${DELETE_QUESTION_API}/${questionId}`,null,{
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE QUESTION API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Question");
    }
    toast.success("Question Deleted");
    navigate("/profile");
    result = response?.data?.data;
  } catch (error) {
    console.log("DELETE QUESTION API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
