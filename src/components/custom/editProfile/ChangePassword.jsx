import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { ShineBorder } from "../../magicui/shine-border";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "@/services/operations/userAPI";
import toast from "react-hot-toast";
export function ChangePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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

  const submitProfileForm = async (data, e) => {
    e.preventDefault();
    console.log("Form data", data);
    if (data.newPassword === data.oldPassword) {
      toast.error("New Password cannot be current password");
      return;
    }
    try {
      const response = dispatch(
        changePassword(token, data, navigate, setIsLoading)
      );
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
  return (
    <div className=" relative shadow-input border border-gray-700 mx-auto w-9/12 rounded-none  p-2 md:rounded-2xl md:p-8 bg-black">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <h2 className="text-3xl font-extrabold text-neutral-200">
        Change Password
      </h2>
      <MdEdit />
      <form className="my-8" onSubmit={handleSubmit(submitProfileForm)}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="oldPassword" className="text-white ml-2 text-start">
              Current Password
            </Label>
            <Input
              id="oldPassword"
              placeholder="••••••••"
              className="bg-gray-900 outline-none focus:!ring-0  text-white"
              type={showOldPassword ? "text" : "password"}
              {...register("oldPassword", { required: true })}
            />
            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-[35px] z-[10] cursor-pointer"
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.oldPassword && (
              <span className="-mt-1 text-start text-red-500 text-sm">
                Please enter your current Password.
              </span>
            )}
          </LabelInputContainer>

          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="newPassword" className="text-white ml-2 text-start">
              New Password
            </Label>
            <Input
              id="newPassword"
              placeholder="••••••••"
              className="bg-gray-900 outline-none focus:!ring-0  text-white"
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword", { required: true })}
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-[35px] z-[10] cursor-pointer"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.newPassword && (
              <span className="-mt-1 text-start text-red-500 text-sm">
                Please enter your New Password.
              </span>
            )}
          </LabelInputContainer>
        </div>

        <div className="self-end flex gap-5">
          {" "}
          <button
            className="group/btn relative block h-10  px-5 rounded-md bg-gradient-to-br  font-medium text-white bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
            disabled={isLoading}
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
