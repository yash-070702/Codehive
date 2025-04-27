import React, { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { FaArrowCircleUp } from "react-icons/fa";
import { askAI } from "@/services/operations/questionAPI";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Vortex } from "@/components/ui/vortex";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Input } from "@/components/magicui/input";
import Boxes from "@/components/custom/Boxes";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { useNavigate } from "react-router-dom";
const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Stores conversation history
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const askToAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const userQuestion = question; // Store user's question
    setQuestion(""); // Clear input field immediately

    try {
      const aiResponse = await askAI(userQuestion);
      setChatHistory((prev) => [
        ...prev,
        { question: userQuestion, answer: aiResponse },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          question: userQuestion,
          answer: "❌ Failed to get response. Try again.",
        },
      ]);
    }
    setLoading(false);
  };

  // Handle Enter key press for submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      askToAI();
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div>
      <Vortex
        backgroundColor="transparent"
        className="mt-8 px-2 md:px-10 overflow-y-hidden h-[100vh] w-full "
      >
        <div className="text-white text-4xl mb-9">
          👉 "Got Stuck? Ask HiveMind!"
        </div>
        <div className="p-4 relative  text-white rounded-lg w-[1000px] mx-auto flex flex-col h-[80vh]">
          <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
          <h2 className="text-2xl font-thin italic mb-2 text-center">
            HiveMind AI
          </h2>

          {/* Scrollable Conversation Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-2 bg-transparent rounded-md border border-gray-700"
          >
            {chatHistory.map((chat, index) => (
              <div key={index} className="mb-4 flex flex-col">
                {/* User Question - Left Side */}
                <div className="flex justify-end">
                  <div className="bg-gray-900 !text-start text-white p-3 rounded-lg min-w-[20%] max-w-[60%]">
                    <p className="leading-8">{chat.question}</p>
                  </div>
                </div>

                {/* AI Response - Right Side */}
                <div className="flex justify-start mt-2">
                  <div className=" !p-3 rounded-lg  !p-3 min-w-[20%] max-w-[65%]">
                    <MarkdownPreview source={chat.answer} />
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-gray-400 text-center mt-2">
                Generating response...
              </p>
            )}
          </div>

          {/* Fixed Input Field */}
          <div className="flex gap-2 mt-4">
            <Input
              type="text"
              placeholder="Ask something..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown} // Submit on Enter
              className="text-white relative !placeholder-gray-500 focus:!outline-none border-gray-700"
            />
            <button
              onClick={askToAI}
              className="pl-2 absolute bottom-12 right-10  rounded"
            >
              <FaArrowCircleUp size={20} />
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            HiveMind can make mistakes. Check important info.
          </p>
        </div>
      </Vortex>
      <div className="text-white flex flex-col gap-6">
        <p className="text-3xl">Still Unsure? Consult the Human Mind 🔍</p>
        <ShimmerButton
          className="mx-auto"
          onClick={() => navigate("/askQuestion")}
        >
          Ask Question
        </ShimmerButton>
      </div>
      <Boxes />
    </div>
  );
};

export default AskAI;
