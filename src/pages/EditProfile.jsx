import Boxes from "@/components/custom/Boxes";
import { ChangePassword } from "@/components/custom/editProfile/ChangePassword";
import ChangeProfilePicture from "@/components/custom/editProfile/ChangeProfilePicture";
import DeleteAccount from "@/components/custom/editProfile/DeleteAccount";
import { ProfileEdit } from "@/components/custom/editProfile/ProfileEdit";

import React from "react";
const EditProfile = () => {
  return (
    <div className=" mx-auto w-9/12">
      <h1 className="text-white text-4xl text-start ml-40 my-10 ">
        Edit Profile Details
      </h1>
      <div className=" mx-auto">
       <ChangeProfilePicture/>
      </div>
      <div className=" mx-auto">
        {" "}
        <ProfileEdit />
      </div>
      <div className="  mx-auto mt-10">
        {" "}
        <ChangePassword />
      </div>
      <div className="  mx-auto">
        {" "}
        <DeleteAccount />
      </div>

      <Boxes />
    </div>
  );
};

export default EditProfile;
