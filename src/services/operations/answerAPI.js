import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { answerEndpoints } from "../apis";

const {
  CREATE_ANSWER_API,
  VOTE_ANSWER_API,
  PENDING_ANSWERS_API,
  APPROVE_ANSWER_API,
  DELETE_ANSWER_API,
  UPDATE_ANSWER_API
} = answerEndpoints;

export const createAnswer = (questionId, token, content, navigate) => {
  return async (dispatch) => {
    // ✅ This returns a function (Thunk)
    const toastId = toast.loading("Submitting your answer...");

    try {
      const response = await apiConnector(
        "POST",
        CREATE_ANSWER_API,
        {
          content,
          questionId,
        },
        { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      );

      console.log("CREATEANSWER API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Answer Submitted Successfully");
      navigate(`/reviewConfirmation/${questionId}`); // Navigate to the review confirmation page
    } catch (error) {
      console.error("CREATE_ANSWER_API ERROR:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const approveAnswer = (answerId, decision, token) => {
  return async (dispatch) => {
    const toastId = toast.loading(
      decision === "approve" ? "Approving answer..." : "Declining answer..."
    );

    try {
      const response = await apiConnector(
        "POST",
        `${APPROVE_ANSWER_API}/${answerId}`,
        { decision },
        { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      );

      console.log("APPROVE_ANSWER_API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success(
        decision === "approve"
          ? "Answer Approved Successfully!"
          : "Answer Declined Successfully!"
      );
    } catch (error) {
      console.error("APPROVE_ANSWER_API ERROR:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const updateAnswer = (answerId, token, content) => {
  return async (dispatch) => {
    const toastId = toast.loading("Updating your answer...");

    try {
      const response = await apiConnector(
        "PUT", // Use PUT or PATCH depending on your API setup
        `${UPDATE_ANSWER_API}/${answerId}`, // API URL with answerId
        { content }, // sending only content
        { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      );

      console.log("UPDATEANSWER API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Answer Updated Successfully");

    } catch (error) {
      console.error("UPDATE_ANSWER_API ERROR:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const voteAnswer = async (answerId, voteType, token) => {
  const toastId = toast.loading("Processing vote...");
  let result = [];
  try {
    const response = await apiConnector(
      "PUT",
      `${VOTE_ANSWER_API}/${answerId}`, // Corrected API endpoint
      { voteType }, // Only send voteType in body
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    console.log("VOTE ANSWER API RESPONSE:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not cast vote");
    }

    result = response?.data;
    toast.success("Vote recorded successfully");
  } catch (error) {
    console.error("VOTE ANSWER API ERROR:", error);
    toast.error(
      error.response?.data?.message || "Something went wrong. Try again later."
    );
  }
  toast.dismiss(toastId);
  return result;
};

export const getPendingAnswers = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      PENDING_ANSWERS_API,
      {},
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Pending Answers");
    }
    //   console.log(response);
    result = response?.data;
    console.log("PENDING_ANSWER API RESPONSE............", result);
  } catch (error) {
    console.log("PENDING_ANSWER API API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export function deleteAnswer(token,answerId) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE",`${DELETE_ANSWER_API}/${answerId}`,{}, {
        Authorization: `Bearer ${token}`,
      });
      console.log("DELETE_ANSWER_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Answer Deleted Successfully");
    } catch (error) {
      console.log("DELETE_ANSWER_API API ERROR............", error);
      toast.error(error);
    }
    toast.dismiss(toastId);
  };
}
