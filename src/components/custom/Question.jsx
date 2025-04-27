import React from "react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { BiSolidUpArrow } from "react-icons/bi";
import { BiSolidDownArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosSend } from "react-icons/io";
import { createAnswer } from "@/services/operations/answerAPI";
import convertDateToRelativeTime from "@/utils/relativeTime";
import MarkdownEditor from "./MarkdownEditor";
import { ShimmerButton } from "../magicui/shimmer-button";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Boxes from "./Boxes";
import {
  deleteQuestion,
  voteQuestion,
} from "@/services/operations/questionAPI";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { ConfirmationModal } from "./ConfirmationModal";
import DisplayAnswer from "./DisplayAnswer";
const Question = ({ questionData }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [addAnswer, setAddAnswer] = useState(false);
  const [answers, setAnswers] = useState(questionData.answers);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [relativeVote, setRelativeVote] = useState(
    questionData.upvotes.length - questionData.downvotes.length
  );

  useEffect(() => {
    setRelativeVote(
      questionData.upvotes.length - questionData.downvotes.length
    );
    console.log("Updated relativeVote:", relativeVote);
  }, [questionData]);

  console.log(questionData);

  const handleVoteQuestion = async (voteType) => {
    try {
      const result = await dispatch(
        voteQuestion(questionData._id, voteType, token)
      );
      setRelativeVote((prev) => (voteType === "upvote" ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      const response = await dispatch(
        deleteQuestion(questionData._id, token, navigate)
      );
      console.log(response);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!markdownContent) {
      toast.error("Answer can't be empty");
      return;
    }
    setIsLoading(true);

    try {
      setMarkdownContent("");
      await dispatch(
        createAnswer(questionData._id, token, markdownContent, navigate)
      );
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Try again later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleBack = () => {
      if (addAnswer) {
        setAddAnswer(false); // Close answer form instead of navigating
      } else {
        navigate(-1); // Go to previous page if addAnswer is false
      }
    };

    // Intercept browser's back button
    const onPopState = (event) => {
      event.preventDefault();
      handleBack();
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [addAnswer, navigate]);

  return (
    <div>
      <div className="text-white w-[920px] mt-10  mx-auto">
        <div className="text-white flex items-center justify-between">
          <div className="">
            {" "}
            <h1 className="text-4xl text-start">{questionData.title}</h1>
            <span className="flex gap-5 mt-2">
              <p>
                Asked:{" "}
                {convertDateToRelativeTime(new Date(questionData.createdAt))}
              </p>
              <p>
                Modified:{" "}
                {convertDateToRelativeTime(new Date(questionData.updatedAt))}
              </p>
              <p>Answers: {questionData.answers.length}</p>
            </span>
          </div>
          {user._id == questionData.user._id && (
            <div>
              {" "}
              <button
                disabled={isLoading}
                title="Edit"
                onClick={() => navigate(`/editQuestion/${questionData._id}`)}
                className="px-2 transition-all duration-200 hover:scale-110 hover:text-green-700"
              >
                <FaPencilAlt size={20} />
              </button>
              <button
                disabled={isLoading}
                onClick={() => {
                  setConfirmationModal({
                    Heading: "Do you want to delete this Question?",
                    Description:
                      "All the comments,answers,votes,your respected reputation related to this question will be deleted",
                    btn1: "Delete",
                    btn2: "Cancel",
                    btn1Handler: () => handleDeleteQuestion(),
                    btn2Handler: () => setConfirmationModal(null),
                  });
                }}
                title="Delete"
                className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
              >
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
          )}
        </div>

        <hr className="border-t-2 border-gray-600 mt-2" />
        <div className="flex  gap-6 mt-5">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleVoteQuestion("upvote")}
              className="p-2 border rounded-full flex justify-center items-center"
            >
              <BiSolidUpArrow size={25} />
            </button>
            <p className="text-3xl">{relativeVote}</p>
            <button
              onClick={() => handleVoteQuestion("downvote")}
              className="p-2 border rounded-full flex justify-center items-center"
            >
              <BiSolidDownArrow size={25} />
            </button>
          </div>
          <div className="flex w-full flex-col">
            <div className="self-start text-start">
              {/* Markdown Preview for Question Description */}

              <MarkdownPreview source={questionData.description} />
            </div>
            <span>{questionData.tried}</span>
            <hr className="border-t-2 border-gray-600 mt-5" />

            <div className="flex justify-between items-center ">
              <div className="flex mt-4 gap-5">
                {questionData.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800 text-gray-400 px-5 py-1 rounded-full"
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <div className="text-white flex mt-4 flex-col gap-1">
                <div className="flex items-center gap-2">
                  By:
                  <img
                    src={questionData.user.image}
                    width={20}
                    className="rounded-full"
                  />
                  <p>{questionData.user.fullName}</p>
                </div>
                <p className="text-gray-500">
                  Last Modified :{" "}
                  {convertDateToRelativeTime(new Date(questionData.createdAt))}
                </p>
              </div>
            </div>
          </div>
        </div>
        

        {!addAnswer && (
          <div>
            <div className="flex mt-20 flex-col">
              <p className="text-3xl self-start mb-10 underline">
                {questionData.answers.length > 0 && questionData.answers.length}{" "}
                Answers -:
              </p>

              {/* Markdown Editor for Answer */}
              <div className="flex flex-col  gap-10">
                {answers.length === 0 && (
                  <div className="flex justify-center items-center">
                    <p className="text-xl text-gray-200">No answers yet.</p>
                  </div>
                )}
                {answers.length > 0 &&
                  answers.map((answer, idx) => (
                    <div key={idx}>
                      <DisplayAnswer
                        answers={answers}
                        setAnswers={setAnswers}
                        questionData={questionData}
                        questionOwner={questionData.user._id}
                        answer={answer}
                        token={token}
                      />
                    </div>
                  ))}
              </div>
              <hr className="border-t-2 border-gray-600 mt-5" />
            </div>

            <div className="mx-auto flex justify-center">
              <ShimmerButton
                onClick={() => setAddAnswer(true)}
                className="shadow-2xl mt-5"
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  <span className="text-white flex gap-2">
                    Add Answer <IoIosSend />
                  </span>
                </span>
              </ShimmerButton>
            </div>
          </div>
        )}

        {addAnswer && (
          <div className="flex mt-20 flex-col">
            <p className="text-3xl mb-10">Your Answer</p>
            <form onSubmit={handleSubmit}>
              <MarkdownEditor
                onChange={setMarkdownContent}
                value={markdownContent}
              />
              {/* <button  className=""> */}
              <ShimmerButton
                type="submit"
                className="shadow-2xl self-start mt-5"
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  <span className="text-white flex gap-2">
                    Post Answer <IoIosSend />
                  </span>
                </span>
              </ShimmerButton>
              {/* </button> */}
            </form>
          </div>
        )}
      </div>{" "}
      <Boxes />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default Question;
