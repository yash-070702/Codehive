import React from "react";
import { logout } from "@/services/operations/authAPI";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";
import { Bell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { LuMailQuestion } from "react-icons/lu";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { getUserQuestions } from "@/services/operations/questionAPI";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import MyQuestions from "@/components/custom/MyQuestions";
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);
  const [userQuestions, setUserQuestions] = useState([]);

  console.log(user);

  const GetUserQuestions = async () => {
    try {
      const response = await getUserQuestions(user._id);
      console.log(response.questions);
      setUserQuestions(response.questions);
      console.log(userQuestions);
    } catch (error) {
      console.log("Unable to fetch top questions");
    }
  };
  useEffect(() => {
    GetUserQuestions();
  }, []);
  return (
    <div>
      <div className="container w-9/12 mx-auto space-y-4 px-4 pb-20 pt-32">
        <div className="flex flex-col gap-4 sm:flex-row ">
          <div className="w-40 shrink-0">
            <picture className="block w-full">
              <img
                src={user.image}
                // alt="yash"
                className="h-full w-full rounded-xl object-cover"
              />
            </picture>
          </div>
          <div className="w-full ">
            <div className="flex items-start justify-between ">
              <div className="block flex flex-col  space-y-0.5 ">
                <h1 className="text-3xl font-bold  self-start text-white">
                  {user.fullName}
                </h1>
                <p className="text-yellow-500 font-semibold self-start">
                  Reputation: {user.reputation}⭐
                </p>
                <p className="text-lg text-gray-500">{user.email}</p>
                <p className="text-lg text-gray-500 self-start">
                  @{user.userName}
                </p>

                <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
                  <IconUserFilled className="w-4 shrink-0" /> Dropped{" : "}
                  {convertDateToRelativeTime(new Date(user.createdAt))},
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-500">
                  <IconClockFilled className="w-4 shrink-0" /> Last
                  activity&nbsp;{" : "}
                  {convertDateToRelativeTime(new Date(user.updatedAt))}
                </p>
              </div>

             <div className="flex flex-col  h-full justify-between gap-2">
             <div className="flex items-center  gap-2">
                {" "}
                <ShimmerButton
                  onClick={() => navigate("/editProfile")}
                  className="shadow-2xl"
                >
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    <span className="text-white flex gap-2">
                      Edit Profile <MdEdit />
                    </span>
                  </span>
                </ShimmerButton>
                <ShimmerButton
                  onClick={() => navigate("/allNotifications")}
                  className=" !p-3 shadow-2xl   text-white  "
                  title="Notifications"
                >
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    <span className="text-white flex gap-2">
                       <Bell className="w-5 h-5" />
                    </span>
                  </span>
                </ShimmerButton>
              </div>
              <ShimmerButton
                  onClick={() => navigate("/pendingAnswers")}
                  className="shadow-2xl self-start mt-17"
                >
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    <span className="text-white flex gap-2">
                      Pending Answers ⏳ 
                    </span>
                  </span>
                </ShimmerButton>
             </div>
            </div>
          </div>
        </div>
        <div className="mt-10 ">
          <h1 className="text-white text-3xl font-bold my-5">About Me</h1>
          <p className="text-gray-500  mx-auto text-lg text-start">
            {user.about}
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-white text-5xl mb-10">Your Questions</h1>

        {userQuestions.length === 0 ? (
          <p className="text-white text-lg">No questions yet</p>
        ) : (
          <div>
            <MyQuestions questions={userQuestions} />
          </div>
        )}

        <div className="mx-auto flex gap-10 mt-5">
          {" "}
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
          <ShimmerButton
            onClick={() => navigate("/askAI")}
            className="shadow-2xl"
          >
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              <span className="text-white flex gap-2">Try HiveMind 🤖</span>
            </span>
          </ShimmerButton>
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

export default Profile;
