import React from "react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import QuestionForm from "@/components/custom/QuestionForm";
import { FaSearch } from "react-icons/fa";
const CreateQuestion = () => {
  return (
    <div className="w-9/11 mx-auto mt-10">
      <h1 className="text-white text-4xl text-center ml-10 flex items-center gap-5">
      <FaSearch />Stuck on Something? Get Answers Here!
      </h1>
      <div className="flex justify-between mt-10">
        {" "}
        <QuestionForm />
        <div className="sticky top-10 hidden max-w-[450px] max-h-max flex-1 rounded-md border-[2px] border-gray-700 py-4 px-2 xl:block">
          <p className="mb-8 text-lg text-gray-300">⚡ Question Upload Tips</p>
          <ul className="ml-2 list-item space-y-4 text-xs text-start text-gray-400">
            <li className="flex">
              {" "}
              <p className="font-bold">Be Specific & Clear </p>– Clearly
              describe your problem or topic.
            </li>
            <li className="flex">
            <p className="font-bold">Use a Descriptive Title</p> – Make it easy to understand at a
              glance..
            </li>
            <li className="flex">
            <p className="font-bold">Provide Relevant Details</p> – Include code snippets, errors,
              or examples.
            </li>
            <li className="flex">
            <p className="font-bold">Tag Your Question</p> – Add relevant tags to help others find
              it.
            </li>
            <li className="flex">
            <p className="font-bold">Avoid Duplicate Questions</p> – Search before posting to see
                duplicates.
            </li>
            <li className="flex">
            <p className="font-bold">Stay Professional & Courteous</p> – Be respectful when
              interacting with others.
            </li>
          </ul>
        </div>
      </div>

      <div className="relative mt-20 bg-black bottom-0 flex h-[100px] w-[100vw] items-center justify-center overflow-hidden  border-t  border-gray-800 bg-black p-20">
        <AnimatedGridPattern
          numSquares={300}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-100%] h-[300%] skew-y-12"
          )}
        />
      </div>
    </div>
  );
};

export default CreateQuestion;
