"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/services/operations/authAPI";

export const FloatingNav = ({ navItems, className ,token }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div
      className={cn(
        " mt-6 mx-auto border-1 rounded-4xl  shadow-md z-[5000] px-6 py-3 flex items-center justify-center space-x-6",
        className
      )}
    >
      {navItems.map((navItem, idx) => (
          <Link
            key={`link=${idx}`}
            to={navItem.link}
            className={cn(
              "relative text-neutral-50 items-center flex space-x-1 hover:text-neutral-300 "
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}

        {token ? (
          <button onClick={()=>dispatch(logout(navigate))}  className="border text-sm font-medium relative border-white/[0.2] text-white px-4 py-2 rounded-full">
          <span>Logout</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button>
        ) : 
        (
        <button onClick={()=>navigate("/login")} className="border text-sm font-medium relative border-white/[0.2] text-white px-4 py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button>
        )
        }
    </div>
  );
};