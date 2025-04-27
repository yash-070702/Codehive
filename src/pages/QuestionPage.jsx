import React, { useEffect, useState } from "react";
import Question from "@/components/custom/Question";
import { getQuestionById } from "@/services/operations/questionAPI";
import { useParams } from "react-router-dom";
const QuestionPage = () => {
     const {questionId}=useParams();
     
  const [question, setQuestion] = useState();
  const GetQuestion = async () => {
    try {
      const response = await getQuestionById(questionId);
      setQuestion(response);
    } catch (error) {
      console.log("Unable to fetch question");
    }
  };
  useEffect(() => {
    GetQuestion();
  }, [questionId]); 
  return (
    <div>
      <div className="">
        {" "}
        
        {question ? <Question questionData={question} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default QuestionPage;
