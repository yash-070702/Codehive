import React, { useState, useEffect } from "react";
import { Label } from "@/components/magicui/label";
import { Input } from "@/components/magicui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendOtp } from "@/services/operations/authAPI";
import { setSignupData } from "@/slices/authSlice";
import { BackgroundGradient } from "@/components/ui/background-gradient";
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { fullName, userName, email, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !userName || !email || !password || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }

    setIsLoading(true); // Ensure this is set before dispatch

    const signupData = { ...formData };

    dispatch(setSignupData(signupData));

    try {
      await dispatch(sendOtp(email, navigate)); // Ensure this is awaited
      setFormData({
        fullName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false); // Ensure this always runs
    }
  };

  return (
    <div className="mt-1">
      {" "}
      <BackgroundGradient>
        <div className="mx-auto w-full bg-black max-w-md rounded-none border border-solid border-white/30  p-4 shadow-input  md:rounded-2xl md:px-8 md:pt-8 ">
          <h2 className="text-xl font-bold text-neutral-200">
            Welcome to CodeHive
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-300">
            Signup with CodeHive if you don&apos;t have an account.
            <br /> If you already have an account,{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              login
            </Link>{" "}
            to codehive
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <LabelInputContainer>
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  className="text-white !placeholder-gray-300"
                  id="fullName"
                  name="fullName"
                  onChange={handleOnChange}
                  placeholder="FullName"
                  type="text"
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="userName">username</Label>
                <Input
                  className="text-white !placeholder-gray-300"
                  id="userName"
                  name="userName"
                  onChange={handleOnChange}
                  placeholder="abc"
                  type="text"
                />
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                className="text-white !placeholder-gray-300"
                id="email"
                name="email"
                onChange={handleOnChange}
                placeholder="projectmayhem@fc.com"
                type="email"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                className="text-white !placeholder-gray-300"
                id="password"
                name="password"
                onChange={handleOnChange}
                placeholder="Your Password"
                type="password"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="confirmPassword">Re-type password</Label>
              <Input
                className="text-white !placeholder-gray-300"
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleOnChange}
                placeholder="Re-type password"
                type="password"
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
              disabled={isLoading}
            >
              Sign up &rarr;
              <BottomGradient />
            </button>

            <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
          </form>
        </div>
      </BackgroundGradient>
    </div>
  );
}
