"use client";
import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { ShineBorder } from "../../magicui/shine-border";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "@/services/operations/userAPI";
export function ProfileEdit() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const aboutText = watch("about", "");
  const wordCount = aboutText.trim().split(/\s+/).filter(Boolean).length;

  const submitProfileForm = async (data, e) => {
    e.preventDefault();
    console.log("Form data", data);
    try {
      const response = dispatch(updateProfile(token, data, navigate));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  return (
    <div className=" relative shadow-input border border-gray-700 mx-auto w-9/12 rounded-none  p-4 md:rounded-2xl md:p-8 bg-black">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <h2 className="text-3xl font-extrabold text-neutral-200">
        Edit Information
      </h2>
      <MdEdit />
      <form className="my-8" onSubmit={handleSubmit(submitProfileForm)}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="fullName" className="ml-2 text-white text-start">
              Full name
            </Label>
            <Input
              id="fullName"
              className="bg-gray-900 text-white outline-none focus:!ring-0"
              placeholder="Your full name"
              type="text"
              {...register("fullName", { required: true })}
              defaultValue={user?.fullName}
            />
            {errors.fullName && (
              <span className="-mt-1 text-start text-red-500 text-sm">
                Please enter your Name.
              </span>
            )}
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="about" className="text-white ml-2 text-start">
            About
          </Label>
          <Input
            className="bg-gray-900 outline-none focus:!ring-0 h-[200px] text-white"
            id="about"
            placeholder="About Yourself......"
            type="text"
            {...register("about", {
              validate: (value) =>
                value.trim().split(/\s+/).filter(Boolean).length <= 100 ||
                "Maximum 100 words allowed",
            })}
            defaultValue={user?.about}
          />
          <p className="text-gray-400 text-sm text-start mb-5">
            Word Count: {wordCount}/100
          </p>
          {errors.about && (
            <p className="-mt-5 text-start text-red-500 text-sm">
              {errors.about.message}
            </p>
          )}
        </LabelInputContainer>

        {/* <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer> */}
        {/* <LabelInputContainer className="mb-8">
          <Label htmlFor="twitterpassword">Your twitter password</Label>
          <Input id="twitterpassword" placeholder="••••••••" type="twitterpassword" />
        </LabelInputContainer> */}

        <div className="self-end flex gap-5">
          {" "}
          <button
            className="group/btn relative block h-10  px-5 rounded-md bg-gradient-to-br  font-medium text-white bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Save Changes
            <BottomGradient />
          </button>
          <button
            className="group/btn relative block h-10  px-9 rounded-md bg-gradient-to-br  font-medium text-white bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            onClick={() => navigate("/profile")}
          >
            Cancel
            <BottomGradient />
          </button>
        </div>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent  to-transparent via-neutral-700" />
      </form>
    </div>
  );
}

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
