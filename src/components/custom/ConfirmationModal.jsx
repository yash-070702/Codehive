import React from "react";
import { Meteors } from "../ui/meteors";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";
export function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-opacity-10 backdrop-blur-sm">
      <div className="relative w-full max-w-xl">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
        <div className="relative flex h-full flex-col items-center justify-end overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 px-4 py-8 shadow-xl">
          <h1 className="relative z-50 mb-4 text-3xl font-bold text-white">
            {modalData.Heading}
          </h1>

          <p className="relative z-50 mb-4 text-base font-2xl text-slate-500">
            {modalData.Description}
          </p>

          <div className="flex gap-5">
            <InteractiveHoverButton
              onClick={modalData.btn1Handler}
              color={"red-500"}
            >
              {modalData.btn1}
            </InteractiveHoverButton>

            <InteractiveHoverButton
              color={"blue-500"}
              onClick={modalData.btn2Handler}
            >
              {modalData.btn2}
            </InteractiveHoverButton>
          </div>

          {/* Meaty part - Meteor effect */}
          <Meteors number={20} />
        </div>
      </div>
    </div>
  );
}
