import React, { useState } from "react";
import { MagicCard } from "../magicui/magic-card";
import { Label } from "@/components/magicui/label";
import { Input } from "@/components/magicui/input";
import MarkdownEditor from "./MarkdownEditor";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createQuestion,
  fetchSuggestedTags,
} from "@/services/operations/questionAPI";
import { ShimmerButton } from "../magicui/shimmer-button";

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const QuestionForm = () => {
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tried: "",
    tags: [],
  });
  const { title, description, tried, tags } = formData;

  // Fetch AI tags when description changes

  const generateTags = async () => {
    if (description.length > 10) {
      setLoadingTags(true); // Start loading
      const suggestedTags = await fetchSuggestedTags(description);
      setFormData((prevData) => ({
        ...prevData,
        tags: Array.from(new Set([...prevData.tags, ...suggestedTags])).slice(
          0,
          5
        ), // Limit to 5 tags
      }));
      setLoadingTags(false); // Stop loading
    }
  };

  // Handle input changes
  const handleOnChange = (e, fieldName) => {
    if (typeof e === "string") {
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: e,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle adding tags
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim().toLowerCase();

      // Avoid duplicate tags
      if (!tags.includes(newTag)) {
        setFormData((prevData) => ({
          ...prevData,
          tags: [...prevData.tags, newTag],
        }));
      }
      e.target.value = "";
    }
  };

  // Handle removing tags
  const removeTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    // console.log(token);

    if (!title || !description) {
      toast.error("Please fill out all required details");
      return;
    }
    if (tags.length == 0) {
      toast.error("Please add at least one tag");
      return;
    }

    setIsLoading(true);
    const questionData = { ...formData };

    try {
      await dispatch(createQuestion(questionData, token, navigate));
      setFormData({ title: "", description: "", tried: "", tags: [] });
    } catch (error) {
      console.error("Error creating question:", error);
      // toast.error("Failed to post Question");
    } finally {
      setIsLoading(false); // Ensure this always runs
    }
  };

  return (
    <div className="text-white w-9/16 mx-auto">
      <MagicCard gradientColor="#262626">
        <form className="p-5" onSubmit={handleSubmit}>
          {/* Title Input */}
          <Label htmlFor="title" className="flex flex-col items-start">
            <div className="flex items-start">
              <p className="text-2xl">Title</p>
              <span className="text-red-500 text-[10px] pt-1">✶</span>
            </div>
            <p className="text-gray-500 mb-4 text-[1.05rem]">
              Be specific and imagine you’re asking a question to another person
            </p>
          </Label>
          <Input
            className="text-white !placeholder-gray-400"
            id="title"
            onChange={handleOnChange}
            name="title"
            placeholder="Please Mention the relevant title to your Question"
            type="text"
          />

          {/* Description */}
          <Label
            htmlFor="description"
            className="flex flex-col items-start mt-5"
          >
            <div className="flex items-start">
              <p className="text-2xl">Body</p>
              <span className="text-red-500 text-[10px] pt-1">✶</span>
            </div>
            <p className="text-gray-500 mb-4 text-[1.05rem]">
              Include all the information someone would need to answer your
              question
            </p>
          </Label>
          <MarkdownEditor
            onChange={(value) => handleOnChange(value, "description")}
            value={description}
          />

          {/* What Have You Tried? */}
          <Label htmlFor="tried" className="flex flex-col items-start mt-5">
            <div className="flex items-start">
              <p className="text-2xl">Tried</p>
            </div>
            <p className="text-gray-500 mb-4 text-[1.05rem]">
              Explain what you’ve tried so far and where you’re stuck
            </p>
          </Label>
          <MarkdownEditor
            onChange={(value) => handleOnChange(value, "tried")}
            value={tried}
          />

          {/* Tags Input */}

          {loadingTags ? (
            <p className="text-gray-600 text-xl mt-10">Loading tags......</p> // Show loading text
          ) : (
            <div>
              {" "}
              <Label htmlFor="tags" className="flex flex-col items-start mt-5">
                <div className="flex items-start">
                  <p className="text-2xl">Tags</p>
                </div>
                <div className="flex items-center w-full justify-between">
                  {" "}
                  <p className="text-gray-500 mb-4 text-[1.05rem]">
                    Add up to 5 relevant tags (press Enter to add a tag)
                  </p>
                  <ShimmerButton
                    onClick={generateTags}
                    className="mb-3 self-end"
                  >
                    Generate Tags
                  </ShimmerButton>
                </div>
              </Label>
              <Input
                className="text-white !placeholder-gray-300"
                id="tags"
                placeholder="e.g., react, javascript, express"
                type="text"
                onKeyDown={handleTagKeyDown}
              />
            </div>
          )}

          {/* Display Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-full text-sm text-white"
              >
                {tag}
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600"
                  onClick={() => removeTag(tag)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            className="group/btn relative block h-10 px-15 mt-5 mx-auto rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={isLoading || loadingTags}
          >
            Post Question &rarr;
            <BottomGradient />
          </button>
        </form>
      </MagicCard>
    </div>
  );
};

export default QuestionForm;
