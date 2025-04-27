import { useEffect, useState } from "react";
import AllPendingAnswer from "@/components/custom/AllPendingAnswer";
import { getPendingAnswers } from "@/services/operations/answerAPI";
import React from "react";
import { useSelector } from "react-redux";
import Boxes from "@/components/custom/Boxes";

const PendingAnswers = () => {
  const { token } = useSelector((state) => state.auth);
  const [pendingAnswers, setPendingAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const GetPendingAnswers = async () => {
    setLoading(true);
    try {
      const response = await getPendingAnswers(token);
      setPendingAnswers(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Unable to fetch pending Answers", error);
      setError("Unable to fetch Pending Answers");
      setLoading(false);
    }
  };

  useEffect(() => {
    GetPendingAnswers();
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
      <div className=" w-[600px] mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center my-8">
        Pending Answers
      </h1>
      <p className="text-sm md:text-lg text-gray-400 text-center max-w-2xl mx-auto mt-2">
        "The right answer is waiting for you. Time to make it official!"
      </p>

      {pendingAnswers.length === 0 ? (
          <p className="text-gray-600 mt-10 text-2xl">No pending answers. 🎉</p>
        ) : (
          pendingAnswers.map((answer, index) => (
            <AllPendingAnswer key={index} answer={answer} />
          ))
        )}
    </div>
    <Boxes/>
    </div>
  );
};

export default PendingAnswers;
