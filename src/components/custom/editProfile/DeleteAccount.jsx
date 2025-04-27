import { ConfirmationModal } from "@/components/custom/ConfirmationModal";
import React, { useState } from 'react'
import { FiTrash2 } from "react-icons/fi"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteProfile } from "@/services/operations/userAPI";
const DeleteAccount = () => {
  const {token}=useSelector((state)=>state.auth);
  const [confirmationModal,setConfirmationModal]=useState(null);
  const navigate=useNavigate();
  const dispatch = useDispatch();
  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <div>
     <div className="my-10 pt-3 w-9/12 mx-auto text-white flex flex-col md:flex-row gap-x-5 items-center lg:items-start rounded-md border-[1px] border-pink-700 bg-pink-900  md:p-8 md:px-12">
          <div className="flex aspect-square h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-pink-700">
            <FiTrash2 className="text-3xl text-pink-200"/>
          </div>
          <div className="flex flex-col items-center  lg:items-start space-y-2">
            <h2 className="text-lg font-semibold text-richblack-5">
              Delete Account
            </h2>
            <div className="lg:w-3/5 px-4 lg:px-0 text-center lg:text-start text-pink-25">
              <p>Would you like to delete account?</p>
              <p>
              Deleting your account is
                permanent and will remove all the Questions and Answers associated with it.
              </p>
            </div>
            <button
              type="button"
              className="w-fit cursor-pointer italic pb-10 lg:pb-0 text-pink-300"
              onClick={() => 
              setConfirmationModal({
              Heading:"Are You Sure ?",
              Description:"Deleting your account is permanent and will remove all the contain associated with it. (Your Account Will be Deleted Permanently)",
              btn1:"Delete",
              btn2:"Cancel",
              btn1Handler:()=>handleDeleteAccount(),
              btn2Handler:()=>setConfirmationModal(null)
              }
              )}
              

            >
              I want to delete my account.
            </button>
          </div>
        </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  );
};

export default DeleteAccount;
