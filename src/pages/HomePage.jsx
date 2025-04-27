import React from "react";
import HighlightText from "../components/custom/HighlightText";

import { FaLongArrowAltRight } from "react-icons/fa";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useSelector } from "react-redux";
import { LuMailQuestion } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { UspList } from "@/components/custom/UspList";
const HomePage = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-9/11 mx-auto ">
      {" "}
      <div className="flex flex-col md:flex-row flex-col-reverse items-center justify-center  mt-15 mx-auto">
        <div className=" flex mx-2 flex-col  justify-center items-center gap-2">
          <h1 className="text-4xl flex text-white font-bold tracking-tighter md:text-5xl lg:text-7xl">
            Code
            <HighlightText text={" Hive "} />
          </h1>
          <p className="text-white text-lg ">
            Ask questions,share your knowledge , and collaborate with developers
            world-wide. This join our community and enhance your coding skills.
          </p>
          <div className="mt-2 flex flex-col md:flex-row gap-10">
            {" "}
            {!token ? (
              <ShimmerButton
                onClick={() => navigate("/login")}
                className="shadow-2xl"
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  <span className="text-white flex gap-2">
                    <button className="relative text-white flex  gap-2 items-center justify-center overflow-hidden">
                      {" "}
                      <span>Join Now</span>
                      <FaLongArrowAltRight />
                    </button>
                  </span>
                </span>
              </ShimmerButton>
            ) : (
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
            )}
            <div className="">
        <ShimmerButton onClick={()=>navigate("/askAI")} className="mx-auto">🤖 Ask Our AI, Get Instant Insights 🚀</ShimmerButton>
      </div>
          </div>
        </div>
        <div className="">
       
          <UspList />
        </div>

      
      </div>
  
    </div>
  );
};

export default HomePage;
