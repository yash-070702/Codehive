import React from "react";
import { deleteAnswer, voteAnswer } from "@/services/operations/answerAPI";
import { BiSolidUpArrow } from "react-icons/bi";
import { BiSolidDownArrow } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import convertDateToRelativeTime from "@/utils/relativeTime";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const DisplayAnswer = ({ questionData,questionOwner, answer, token,answers,setAnswers }) => {
  const { user } = useSelector((state) => state.profile);
  const userId = user._id;
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleVoteAnswer = async (voteType, answerId) => {
    try {
      const result = await dispatch(voteAnswer(answerId, voteType, token));
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  async function handleDeleteAnswer() {
        try {
          dispatch(deleteAnswer(token,answer._id))
          setAnswers(answers.filter((ans) => ans._id !== answer._id))
        } catch (error) {
          console.log("ERROR MESSAGE - ", error.message)
        }
      }
  return (
    <div>
      <div className="flex gap-6 mt-5">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleVoteAnswer("upvote", answer._id)}
            className="p-2 border rounded-full flex justify-center items-center"
          >
            <BiSolidUpArrow size={25} />
          </button>
          <p className="text-3xl">{answer.upvotes.length}</p>
          <button
            onClick={() => handleVoteAnswer("downvote", answer._id)}
            className="p-2 border rounded-full flex justify-center items-center"
          >
            <BiSolidDownArrow size={25} />
          </button>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-30 w-full  justify-between">
            <div className="self-start text-start">
              <MarkdownPreview source={answer.content} />
            </div>
            <div>
            {(userId===answer.user._id) &&(
               <button
                              // disabled={isLoading}
                              title="Edit"
                              onClick={() => navigate(`/updateAnswer/${answer._id}`, { state: { answer, questionData } })}

                              className="px-2 transition-all duration-200 hover:scale-110 hover:text-green-700"
                            >
                              <FaPencilAlt size={20} />
                            </button>
            )}
             {(userId===answer.user._id  ||
              userId=== questionOwner) && (
              <button
              onClick={handleDeleteAnswer}
                title="Delete"
                className="px-1 transition-all self-end duration-200 hover:scale-110 -translate-x-1 hover:text-[#ff0000]"
              >
                <RiDeleteBin6Line size={20} />
              </button>
            )}</div>
           
          </div>
          <hr className="border-t-2 border-gray-600 mt-5" />{" "}
          <div className="text-white flex mt-4 self-end  flex-col gap-1">
            <div className="flex items-center  gap-2">
              By :
              <img
                src={answer.user.image}
                width={20}
                className="rounded-full"
              />
              <p>{answer.user.fullName}</p>
            </div>
            <p className="text-gray-500 self-start">
              Last Modified :{" "}
              {convertDateToRelativeTime(new Date(answer.createdAt))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayAnswer;
