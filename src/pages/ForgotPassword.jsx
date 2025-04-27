import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux';
import { getPasswordResetToken } from '@/services/operations/authAPI';
const BottomGradient = () => {
    return (
      <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
      </>
    );
  };
const ForgotPassword = () => {

    const[emailSent,setEmailSent]=useState(false);
    const[email,setEmail]=useState("");
    const dispatch=useDispatch();

const{loading}=useSelector((state)=>state.auth);

const handleOnSubmit= (e)=>{
    e.preventDefault();
     dispatch(getPasswordResetToken(email,setEmailSent))

}

  return (
    <div className="flex text-white mt-20 border rounded-xl border-gray-400 w-11/12 mx-auto justify-center items-center">
        { loading ? (
 <div className='text-white font-bold spinner'></div>
        ):(
            <div className="max-w-[500px]  p-4 lg:p-8">
            <h1 className="text-[1.875rem] font-semibold text-center leading-[2.375rem] text-gray-300">
            {
                !emailSent?(
                    "Reset Your Password"
                ):(
                    "Check Your Mail"
                )
            }
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-center text-gray-500">
  {
            !emailSent
                ? ("Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery")
                : (`We have sent the reset email to ${email}`)}
        
          </p>
          <form onSubmit={handleOnSubmit}>
            {
                !emailSent &&(
                    <label className='self-start '>
                    <p className="mb-1 text-[0.875rem]  text-start leading-[1.375rem] text-gray-200">
                  Email Address <sup className="text-red-500">*</sup>
                </p>
                        <input required type='text' name='email' value={email} 
                        placeholder='Enter Your Email address'
                        onChange={(e)=>{
                            setEmail(e.target.value)
                        }}
                              className="form-style text-white bg-gray-800
                              py-3 mt-2 pl-3 rounded-lg w-full"
                        />
                    </label>
                )
            }
            <button
              className="group/btn mt-3 relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            //   disabled={isLoading}
            >
              {!emailSent ? "Sumbit" : "Resend Email"}
              <BottomGradient />
            </button>
            {/* <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              {!emailSent ? "Sumbit" : "Resend Email"}
            </button> */}
          </form>
          <div className="mt-6 flex mx-auto items-center text-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-center text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
           </div>
        )}
      
    </div>
  )
}

export default ForgotPassword
