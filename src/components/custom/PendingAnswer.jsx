import React from "react";
import { MagicCard } from "../magicui/magic-card";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import MarkdownPreview from "@uiw/react-markdown-preview";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { approveAnswer } from "@/services/operations/answerAPI";
import { useDispatch, useSelector } from "react-redux";
const PendingAnswer = ({ answer, setPendingAnswers, pendingAnswers }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleDecision = async (decision) => {
    try {
      await dispatch(approveAnswer(answer._id, decision, token));

      // ✅ After successful approve/decline -> Update the pending answers list
      setPendingAnswers((prevAnswers) =>
        prevAnswers.filter((a) => a._id !== answer._id)
      );
    } catch (error) {
      console.error("Error in approving/declining:", error);
    }
  };

  return (
    <div className="mt-10">
      <MagicCard gradientColor="#262626 " className="p-5 ">
        <div className="self-start flex flex-col text-start">
          <MarkdownPreview source={answer?.content} />

          <div className="flex justify-between">
            <div className="text-white flex mt-4 flex-col gap-1">
              <div className="flex items-center gap-2">
                By:
                <img
                  src={answer.user.image}
                  width={20}
                  className="rounded-full"
                />
                <p>{answer.user.fullName}</p>
              </div>
              <p className="text-gray-500">
                Posted At: {convertDateToRelativeTime(new Date(answer.createdAt))}
              </p>
            </div>
            <div className="flex gap-5">
              <button
                onClick={() => handleDecision("approve")}
                className="px-1 transition-all text-gray-500 duration-200 hover:scale-110 hover:text-[#1eff00]"
                title="Accept"
              >
                <FaCheck size={20} />
              </button>
              <button
                onClick={() => handleDecision("decline")}
                className="px-1 transition-all text-gray-500 duration-200 hover:scale-110 hover:text-[#ff0000]"
                title="Decline"
              >
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
          </div>
        </div>
      </MagicCard>
    </div>
  );
};

export default PendingAnswer;
