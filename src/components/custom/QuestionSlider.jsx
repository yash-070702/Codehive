import { cn } from "@/lib/utils";
import { Marquee } from "../magicui/marquee";
import { useEffect } from "react";
import { getTopQuestions } from "@/services/operations/questionAPI";
import { useState } from "react";



const ReviewCard = ({
 
  title,
  user,
 description,
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-9/11 cursor-pointer overflow-hidden rounded-xl border p-4",
        // dark styles
        "transform-gpu bg-transparent backdrop-blur-md [border:1px_solid_rgba(255,255,255,.1)] [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center   gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={user.image} />
        <div className="flex flex-col items-start">
          <figcaption className="text-sm font-medium text-white">
           {user.fullName}
          </figcaption>
          <p className="text-xs font-medium text-white/40">@{user.userName}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-2xl text-white">{title}</blockquote>
      <blockquote className="mt-2 text-md text-white">{description}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  const [topQuestions, setTopQuestions] = useState([]);

  const GetTopQuestions = async () => {
    try {
      const response = await getTopQuestions();
      setTopQuestions(response.questions);
      console.log(topQuestions);
    } catch (error) {
      console.log("Unable to fetch top questions");
    }
  };

  useEffect(() => {
    GetTopQuestions();
  }, []);

  return (
    <div className="relative flex my-10 flex-col items-center justify-center">
      {/* Wrap the Marquee inside a div with limited width */}
      <div className="w-[81.81%] mx-auto">
        <Marquee pauseOnHover className="[--duration:20s]">
          {topQuestions.map((question, idx) => (
            <ReviewCard key={idx} {...question} />
          ))}
        </Marquee>
      </div>

      <div className="absolute inset-y-0 left-0 w-1/4"></div>
    </div>
  );
}

  
