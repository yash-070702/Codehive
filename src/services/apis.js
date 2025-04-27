const BASE_URL = import.meta.env.VITE_API_URL

export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
};

export const userEndpoints = {
  DELETE_USER_API: BASE_URL + "/user/deleteUserAccount",
  UPDATE_PROFILE_API: BASE_URL + "/user/updateUserProfile",
  UPDATE_PASSWORD_API: BASE_URL + "/user/changePassword",
  UPDATE_DISPLAYPICTURE_API: BASE_URL + "/user/updateDisplayPicture",
};

export const questionsEndpoints = {
  CREATE_QUESTION_API: BASE_URL + "/question/createQuestion",
  GET_TOP_QUESTION_API: BASE_URL + "/question/getTopQuestions",
  GET_USER_QUESTIONS_API: BASE_URL + "/question/getUserQuestions",
  GET_QUESTION_BY_ID_API: BASE_URL + "/question/getQuestionById",
  GET_QUESTION_BY_ID_FOR_PENDING_ANSWERS_API:BASE_URL+"/question/getQuestionByIdForPendingAnswers",
  GET_ALL_QUESTIONS_API: BASE_URL + "/question/getAllQuestions",
  GET_QUESTIONS_API: BASE_URL + "/question/getQuestions",
  SUGGEST_QUESTION_API: BASE_URL + "/question/questions-suggestions",
  GET_QUESTION_ANSWER_BY_AI_API: BASE_URL + "/question/askAI",
  SUGGEST_TAGS_API: BASE_URL + "/question/generateTags",
  VOTE_QUESTION_API: BASE_URL + "/question/voteQuestion",
  DELETE_QUESTION_API: BASE_URL + "/question/deleteQuestion",
  UPDATE_QUESTION_API:BASE_URL + "/question/updateQuestion",
};

export const answerEndpoints = {
  CREATE_ANSWER_API: BASE_URL + "/answer/createAnswer",
  VOTE_ANSWER_API: BASE_URL + "/answer/voteAnswer",
  PENDING_ANSWERS_API: BASE_URL + "/answer/PendingAnswers",
  APPROVE_ANSWER_API:BASE_URL+"/answer/approveAnswer",
  DELETE_ANSWER_API:BASE_URL+"/answer/deleteAnswer",
  UPDATE_ANSWER_API:BASE_URL+"/answer/editAnswer",
  // GET_ANSWERS_BY_QUESTION_ID_API:BASE_URL+"/answer/getAnswersByQuestionId",
  // GET_ANSWER_BY_ID_API:BASE_URL+"/answer/getAnswerById",
};

export const notificationEndpoints = {
  GET_ALL_NOTIFICATIONS_API: BASE_URL + "/notifications/getAllNotifications",
  DELETE_NOTIFICATION_API: BASE_URL + "/notifications/deleteNotification",
  DELETE_ALL_NOTIFICATION_API:BASE_URL + "/notifications/deleteAllNotifications/clear",
  MARK_AS_READ_NOTIFICATION_API: BASE_URL + "/notifications/markAsRead",
}