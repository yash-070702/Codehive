import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BiSolidUpArrow } from "react-icons/bi";
import { useState, useEffect } from "react";
// import MarkdownEditor from "./MarkdownEditor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { BiSolidDownArrow } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import convertDateToRelativeTime from "../utils/relativeTime";
import { voteQuestion } from "@/services/operations/questionAPI";
import { useDispatch, useSelector } from "react-redux";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import MarkdownEditor from "@/components/custom/MarkdownEditor";
import Boxes from "@/components/custom/Boxes";
import { updateAnswer } from "@/services/operations/answerAPI";
const UpdateAnswer = () => {
  const { id } = useParams(); // this is your answer._id from the URL
  const location = useLocation(); // this is where your objects are passed
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { answer, questionData } = location.state || {};
  const [relativeVote, setRelativeVote] = useState(
    questionData.upvotes.length - questionData.downvotes.length
  );
  const [markdownContent, setMarkdownContent] = useState(answer.content);
    const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!markdownContent) {
      toast.error("Answer can't be empty");
      return;
    }
     setIsLoading(true);

    try {
       console.log(markdownContent);
       setMarkdownContent("");

      await dispatch(
        updateAnswer(answer._id, token, markdownContent)
      );
      navigate(`/question/${questionData._id}`);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Try again later");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {" "}
      <div className="">
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
                    {convertDateToRelativeTime(
                      new Date(questionData.createdAt)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                    Update Answer <IoIosSend />
                  </span>
                </span>
              </ShimmerButton>
              {/* </button> */}
            </form>
          </div>
        </div>
      </div>
      <Boxes/>
    </div>
  );
};

export default UpdateAnswer;
