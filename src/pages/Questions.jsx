import Boxes from "@/components/custom/Boxes";
import React from "react";
import { useState, useEffect } from "react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { LuMailQuestion } from "react-icons/lu";
import { getAllQuestions } from "@/services/operations/questionAPI";
import QuestionComponent from "@/components/custom/QuestionComponent";
import SearchComponent from "@/components/custom/SearchComponent";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const limit = 10; // Number of questions per page

  useEffect(() => {
    fetchQuestions(currentPage, sortBy);
  }, [currentPage, sortBy]);

  const fetchQuestions = async (page, sortBy) => {
    const data = await getAllQuestions(page, limit, sortBy);
    setQuestions(data.questions);
    setTotalPages(data.totalPages);
  };
  return (
    <div>
      {" "}
      <div className="w-9/11  mx-auto">
        <div className="text-white flex my-10 justify-around px-25 items-center">
          <h1 className="text-4xl font-semibold mb-4">All Questions</h1>
          <SearchComponent />
          <ShimmerButton
            onClick={() => navigate("/askQuestion")}
            className="shadow-2xl"
          >
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              <span className="text-white flex gap-2">
                Ask Question <LuMailQuestion />
              </span>
            </span>
          </ShimmerButton>
        </div>

        {/* Radio Buttons for Sorting */}
        <form className="ml-30 flex gap-10 mb-10 max-w-max">
          <div className="flex gap-2">
            <input
              type="radio"
              name="questionType"
              value="newest"
              checked={sortBy === "newest"}
              onChange={(e) => setSortBy(e.target.value)}
            />
            <p className="text-white text-xl">Newest</p>
          </div>
          <div className="flex gap-2">
            <input
              type="radio"
              name="questionType"
              value="topvote"
              checked={sortBy === "topvote"}
              onChange={(e) => setSortBy(e.target.value)}
            />
            <p className="text-white text-xl">Top Vote</p>
          </div>
        </form>

        {/* Render Questions */}
        <div className="space-y-4">
          {questions.map((question, idx) => (
            <QuestionComponent
              key={question._id}
              id={idx}
              question={question}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6  space-x-5">
          <button
            className={`px-4 py-2 bg-gray-700 text-white rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span className="px-4 py-2 bg-gray-200 rounded">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`px-4 py-2 bg-gray-700 text-white rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>{" "}
      <Boxes />
    </div>
  );
};

export default Questions;
