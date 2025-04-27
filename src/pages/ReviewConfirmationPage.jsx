import { ShimmerButton } from "@/components/magicui/shimmer-button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const ReviewConfirmationPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams(); 
  return (
    <div className="flex flex-col items-center mt-40 overflow-y-hidden min-h-screen p-4 text-center">
      <h1 className="text-4xl font-semibold text-white mb-4">
        ✅ Answer Submitted for Review
      </h1>
      <p className="text-xl text-gray-400 mb-6">
        Your answer has been submitted successfully and is awaiting approval by
        the question owner.
      </p>
      <p className="text-md text-gray-200 mb-8">
        We’ll notify you once it gets approved or declined.
      </p>
      <ShimmerButton
        onClick={() => navigate(`/question/${questionId}`)}
        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        {" "}
        🔙 Back to Question
      </ShimmerButton>
    </div>
  );
};

export default ReviewConfirmationPage;
