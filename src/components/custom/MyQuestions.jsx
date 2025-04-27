import React from "react";
import { ShineBorder } from "../magicui/shine-border";
import convertDateToRelativeTime from "@/utils/relativeTime";
import truncateText from "@/utils/truncatePara";
import { useNavigate } from "react-router-dom";
import QuestionComponent from "./QuestionComponent";
const MyQuestions = ({ questions }) => {
  const navigate = useNavigate();
  return (
    <div className="w-9/11 mx-auto ">
      <div className="flex flex-col gap-5 ">
        {questions.map((question, idx) => (
         <QuestionComponent question={question} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default MyQuestions;
