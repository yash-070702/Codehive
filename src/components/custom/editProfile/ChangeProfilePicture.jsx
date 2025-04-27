import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useNavigate } from "react-router-dom";
import { updateDisplayPicture } from "@/services/operations/userAPI";
// import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"
// import IconBtn from "../../../core/HomePage/Common/IconBtn";

export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // console.log(file)
    if (file) {
      setImageFile(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileUpload = () => {
    try {
      console.log("uploading...");
      setLoading(true);
      const formData = new FormData();
      formData.append("displayPicture", imageFile);
      console.log("formdata", formData);
      dispatch(updateDisplayPicture(token, formData, navigate, setLoading));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);
  return (
    <>
      <div className=" relative shadow-input border border-gray-700 mx-auto w-9/12 rounded-none mb-10 p-4 md:rounded-2xl md:p-8 bg-black">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        <div className="flex flex-col md:flex-row items-center gap-x-4">
          <img
            src={previewSource || user?.image}
            alt={`profile-${user?.fullName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-2">
            <p className="text-center text-white text-[1.09rem] md:text-start ">
              Change Profile Picture
            </p>
            <div className="flex flex-row gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />
              <button
                onClick={handleClick}
                disabled={loading}
                className="group/btn relative block h-10 flex items-center  px-9 rounded-md bg-gradient-to-br  font-medium text-white bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              >
                Select
                <BottomGradient />
              </button>

              <button
                className="group/btn relative block h-10 flex items-center  px-9 rounded-md bg-gradient-to-br  font-medium text-white bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                disabled={loading}
                onClick={handleFileUpload}
              >
                {loading ? "Uploading..." : "Upload"}{" "}
                {!loading && (
                  <FiUpload className="text-lg text-richblack-900" />
                )}
                <BottomGradient />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
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
