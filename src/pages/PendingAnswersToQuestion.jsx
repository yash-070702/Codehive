import { useEffect, useState } from "react";
import convertDateToRelativeTime from "@/utils/relativeTime";
import PendingAnswer from "@/components/custom/PendingAnswer";
import Boxes from "@/components/custom/Boxes";
import { getQuestionByIdPendingAnswers } from "@/services/operations/questionAPI";
import { useParams } from "react-router-dom";

const PendingAnswersToQuestion = () => {
  const { questionId } = useParams();
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [pendingAnswers, setPendingAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GetQuestion = async () => {
    setLoading(true);
    try {
      const response = await getQuestionByIdPendingAnswers(questionId);
      setPendingQuestion(response);
      setPendingAnswers(response.answers);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log("Unable to fetch question", error);
      setError("Unable to fetch question"); // set error
      setLoading(false);
    }
  };

  useEffect(() => {
    GetQuestion();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-2xl">Loading Question...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-[1000px] mx-auto">
        <div className="text-white flex items-center justify-between">
          <div>
            <h1 className="text-4xl text-start">{pendingQuestion?.title}</h1>
            <span className="flex gap-5 mt-2">
              <p>
                Asked:{" "}
                {convertDateToRelativeTime(
                  new Date(pendingQuestion?.createdAt)
                )}
              </p>
              <p>
                Modified:
                {convertDateToRelativeTime(
                  new Date(pendingQuestion?.updatedAt)
                )}
              </p>
              <p>Pending Answers : {pendingAnswers.length}</p>
            </span>
          </div>
        </div>
        <hr className="border-t-2 border-gray-600 mt-2" />

        <h2 className="text-2xl font-bold mb-6 text-start mt-20 text-gray-300">
          ⏳ Pending Answers
        </h2>

        {pendingAnswers.length === 0 ? (
          <p className="text-gray-600">No pending answers. 🎉</p>
        ) : (
          pendingAnswers.map((answer, index) => (
            <PendingAnswer
              key={index}
              answer={answer}
              setPendingAnswers={setPendingAnswers}
              pendingAnswers={pendingAnswers}
            />
          ))
        )}
      </div>
      <Boxes />
    </div>
  );
};

export default PendingAnswersToQuestion;
