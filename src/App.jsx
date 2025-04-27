import React, { Suspense, lazy, useEffect } from "react";
import { useState } from "react";
import { Bell } from "lucide-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { Particles } from "./components/magicui/particles";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Questions from "./pages/Questions";
import VerifyEmail from "./pages/verfiyEmail";
import { FloatingNav } from "./components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import PublicRoutesForLogin from "./components/PublicRoute";
import QuestionPage from "./pages/QuestionPage";
import { ShimmerButton } from "./components/magicui/shimmer-button";
import CreateQuestion from "./pages/CreateQuestion";
import CodeHiveLogo from "./assets/codehive_logo.png";
import ForgotPassword from "./pages/ForgotPassword";
import EditProfile from "./pages/EditProfile";
import ReviewConfirmationPage from "./pages/ReviewConfirmationPage";
import AskAI from "./pages/AskAI";
import EditQuestion from "./pages/EditQuestion";
import NotificationPage from "./pages/NotificationPage";
import PendingAnswersToQuestion from "./pages/PendingAnswersToQuestion";
import PendingAnswers from "./pages/PendingAnswers";
import UpdateAnswer from "./pages/UpdateAnswer";
const HomePage = lazy(() => import("./pages/HomePage"));

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Questions",
    link: "/questions",
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
];
const App = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen  bg-black">
      <div className="flex items-center ">
        {" "}
        <img
          onClick={() => navigate("/")}
          src={CodeHiveLogo}
          width={200}
          className="mt-6 hidden md:block -translate-x-50"
        />
        <FloatingNav navItems={navItems} token={token} className="" />
        <ShimmerButton
          onClick={() => navigate("/allNotifications")}
          className="  shadow-2xl mt-6  translate-x-50  text-white  "
          title="Notifications"
        >
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            <span className="text-white flex gap-2">
              Notifications <Bell className="w-5 h-5" />
            </span>
          </span>
        </ShimmerButton>
      </div>
      <div className="z-10 whitespace-pre-wrap text-center  leading-none">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={
              <PublicRoutesForLogin>
                <Login />
              </PublicRoutesForLogin>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoutesForLogin>
                <Signup />
              </PublicRoutesForLogin>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/pendingAnswersToQuestion/:questionId"
            element={
              <PrivateRoute>
                <PendingAnswersToQuestion />
              </PrivateRoute>
            }
          /> 
            <Route
            path="/pendingAnswers"
            element={
              <PrivateRoute>
                <PendingAnswers />
              </PrivateRoute>
            }
          />

          <Route
            path="/editProfile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />


          <Route
            path="/askQuestion"
            element={
              <PrivateRoute>
                <CreateQuestion />
              </PrivateRoute>
            }
          />
          <Route
            path="/editQuestion/:questionId"
            element={
              <PrivateRoute>
                <EditQuestion />
              </PrivateRoute>
            }
          />
            <Route
            path="/updateAnswer/:answerId"
            element={
              <PrivateRoute>
                <UpdateAnswer />
              </PrivateRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/question/:questionId" element={<QuestionPage />} />
       
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reviewConfirmation/:questionId"
            element={
              <PrivateRoute>
                <ReviewConfirmationPage />
              </PrivateRoute>
            }
          />

          <Route
            path="allNotifications"
            element={
              <PrivateRoute>
                <NotificationPage />
              </PrivateRoute>
            }
          />

          <Route path="/askAI" element={<AskAI />} />
        </Routes>
      </div>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        refresh
      />
    </div>
  );
};
export default App;
