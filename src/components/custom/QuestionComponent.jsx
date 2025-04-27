import React from 'react'
import { ShineBorder } from '../magicui/shine-border'
import truncateText from '@/utils/truncatePara'
import { useNavigate } from 'react-router-dom'
import convertDateToRelativeTime from '@/utils/relativeTime'

const QuestionComponent = ({question,idx}) => {
     const navigate = useNavigate();
  return (
    <div onClick={()=>navigate(`/question/${question._id}`)}
                key={idx}
                className="relative w-[1000px] mx-auto flex overflow-hidden px-10 py-6 border items-center border-gray-700 rounded-lg"
              >
                <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                <div className="flex flex-col gap-2 items-end">
                  <p className="text-white">
                    votes{" : "}
                    {question.upvotes.length}
                  </p>
                  <p className="text-white">
                    Answers{" : "}
                  {question.answers.filter((answer) => answer.isApproved).length}
                  </p>

                  
                  <p className="text-white">
                    Downvotes{" : "}
                    {question.downvotes.length}
                  </p>
                </div>
                <div className=" flex flex-col items-start ml-10">
                  {" "}
                  <span className="z-10 text-white text-2xl">{question.title}</span>
                  <p className="text-gray-500 text-start my-2 w-[700px]">{truncateText(question.description,30)}</p>
                  <div className="flex  w-[750px] justify-between items-center">
                    <div className="flex gap-5">
                      {" "}
                      {question.tags.map((tag, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-800 text-gray-400 px-5 py-1 rounded-full"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                    <div className="text-white flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        By:
                        <img
                          src={question.user.image}
                          width={20}
                          className="rounded-full"
                        />
                        <p>@{question.user.userName}</p>
                      </div>
                      <p className="text-gray-500">
                        Last Modified :{" "}
                        {convertDateToRelativeTime(new Date(question.createdAt))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
  )
}

export default QuestionComponent
