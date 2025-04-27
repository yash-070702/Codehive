import React from "react";
import { useState } from "react";
import { Label } from "@/components/magicui/label";
import { Input } from "@/components/magicui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "@/services/operations/authAPI";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill out all fields");
      return;
    }
    setIsLoading(true);
    dispatch(login(email, password, navigate));
    setIsLoading(false);
  };

  return (
    <div className="lg:mt-15">
      <BackgroundGradient>
        <div className="mx-auto bg-black w-full max-w-md rounded-none border border-solid border-white/30  p-4 shadow-input  md:rounded-2xl md:p-8">
          <h2 className="text-xl font-bold text-neutral-200">
            Login to CodeHive
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-300">
            Login to codehive
            <br /> If you don&apos;t have an account,{" "}
            <Link to="/signup" className="text-orange-500 hover:underline">
              Register
            </Link>{" "}
            with codehive
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                className="text-white !placeholder-gray-300"
                id="email"
                onChange={handleOnChange}
                name="email"
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
                placeholder="••••••••"
                type="password"
              />
            </LabelInputContainer>
            <Link to="/forgot-password">
              <p className="mt-6 ml-auto max-w-max text-xs text-blue-100">
                Forgot Password
              </p>
            </Link>

            <button
              className="group/btn mt-3 relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
              disabled={isLoading}
            >
              Log in &rarr;
              <BottomGradient />
            </button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
          </form>
        </div>
      </BackgroundGradient>
    </div>
  );
}
