import React from "react";
import { MagicCard } from "../magicui/magic-card";
import { CiClock2 } from "react-icons/ci";
import Accepted from "../../assets/checked.png";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useNavigate } from "react-router-dom";
import convertDateToRelativeTime from "@/utils/relativeTime";

const AllPendingAnswer = ({answer}) => {
  const navigate = useNavigate();
 
  const handleCardClick = () => {
    navigate(`/pendingAnswersToQuestion/${answer.question._id}`);
  };

  return (
    <div className="mt-10">
      <MagicCard gradientColor="#262626 " className="p-5" >
        <div className="self-start flex flex-col text-start" onClick={handleCardClick}>
        <MarkdownPreview source={answer.content.slice(0, 100) + (answer.content.length > 100 ? "..." : "")} />


          <div className="flex justify-between">
            <div className="text-white flex mt-4 flex-col gap-1">
              <div className="flex items-center gap-2">
                By:
                <img src={answer.user.image} width={20} className="rounded-full" />
                <p>{answer.user.fullName}</p>
              </div>
              <p className="text-gray-500">
                Posted At : {convertDateToRelativeTime(new Date(answer.createdAt))}
              </p>
            </div>
          </div>
        </div>
      </MagicCard>
    </div>
  );
};

export default AllPendingAnswer;
