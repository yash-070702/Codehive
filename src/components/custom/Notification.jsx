import React from "react";
import { MagicCard } from "../magicui/magic-card";
import { motion, AnimatePresence } from "framer-motion";
import Accepted from "../../assets/checked.png";
import Rejected from "../../assets/remove.png";
import Pending from "../../assets/hourglass.png";
import { CiClock2 } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Notification = ({ notification, deleteNotificationHandler, markAsReadHandler }) => {
  const navigate=useNavigate()
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <MagicCard gradientColor="#262626 " className="p-5 ">
        <div className="flex items-center" onClick={()=>{
          if(notification.type==="New Answer Request")
          navigate("/pendingAnswersToQuestion/"+notification.questionId);
        }}>
          {" "}
          <div className="flex items-center gap-5">
            {notification.type === "New Answer Request" && (
              <img src={Pending} width={50} className="" />
            )}

            {notification.type === "Answer Approved" && (
              <img src={Accepted} width={50} className="" />
            )}

            {notification.type === "Answer Declined" && (
              <img src={Rejected} width={50} className="" />
            )}

            <div className="self-start">
              {" "}
              <div className="text-2xl text-start font-semibold  text-gray-100">
                {" "}
                {notification.type}
              </div>
              <div className="text-gray-500 text-start text-lg">
                {notification.message},
              </div>
            </div>
          </div>
          <div className="flex flex-col  justify-center items-center h-[90px] w-[200px] ">
            {" "}
            <div className="flex gap-5">
              {" "}
          { !notification.read &&  <button
                onClick={(e) => {markAsReadHandler(notification._id)
                  e.stopPropagation();
                }}
                className="px-1 transition-all text-gray-500 duration-200 hover:scale-110 hover:text-[#1eff00]"
                title=" Mark as read"
              >
                <FaCheck size={20} />
              </button>
          }
              <button
                onClick={(e) => {
  e.stopPropagation();
  deleteNotificationHandler(notification._id);
}}

                className="px-1 transition-all text-gray-500 duration-200 hover:scale-110 hover:text-[#ff0000]"
                title="Delete notification"
              >
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
            <div className="text-gray-500 flex items-center  gap-2 translate-y-7">
              {" "}
              <CiClock2 color="white" />
              <p>{notification.relativeTime}</p>
            </div>
          </div>
        </div>
      </MagicCard>
    </motion.div>
  );
};

export default Notification;
