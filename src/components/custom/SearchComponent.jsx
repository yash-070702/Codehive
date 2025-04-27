import React from "react";
import { IoMdSearch } from "react-icons/io";
import { useState, useRef } from "react";
import { useEffect } from "react";
import Fuse from "fuse.js";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { Link, useNavigate } from "react-router-dom";
import { getQuestions } from "@/services/operations/questionAPI";
const SearchComponent = () => {
  const [loading, setLoading] = useState(false);
  const [allquestions, setAllquestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const ref = useRef(null);
  const [openInputField, isOpenInputField] = useState(false);

  useOnClickOutside(ref, () => {
    setSearchTerm("");
    isOpenInputField(false);
    setOpen(false);
  });

  const GetQuestions = async () => {
    try {
      const result = await getQuestions();
       setAllquestions(result.questions);
      console.log(result);
    } catch (error) {
      console.log("error",error);
    }
    setLoading(false);
  };

  useEffect(() => {
    GetQuestions();
  }, []);

  useEffect(() => {
    const fuse = new Fuse(allquestions, {
      keys: [
        { name: "title", weight: 0.5 },
        { name: "user.firstName", weight: 0.7 },
        { name: "user.userName", weight: 0.7 },
        { name: "tags", weight: 1} // Ensures searching within array elements
      ],
      includeScore: true, // Optional: Get relevance score for better sorting
      threshold: 1, // Adjust this for better accuracy
      ignoreLocation: true, // Matches anywhere in the string
    });

    if (searchTerm) {
      const searchResults = fuse.search(searchTerm);
      setResults(searchResults.map((result) => result.item));
    }
  }, [searchTerm, allquestions]);

  // console.log(allCourses);

  return (
    <div>
      <div className="hidden lg:block mr-7">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => {
            setOpen(true);
            
          }}
          className="w-[500px] outline-none  rounded-2xl border-richblack-400 border bg-richblack-800 px-[12px] py-1 text-richblack-5"
          ref={ref}
        />
      </div>

      {/* UI for mobile view */}

      <div className="">
        <div
          className="lg:hidden bg-richblack-500 p-[3px] rounded-full"
          onClick={() => {
            isOpenInputField(!openInputField);
            console.log(openInputField);
          }}
        >
          <IoMdSearch color="white" size={25} />
        </div>

        {openInputField && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => {
              setOpen(true);
            }}
            className={` outline-none ${
              openInputField ? "block" : "hidden"
            } absolute w-[300px] top-[2%] left-[0%] z-[1000]   rounded-2xl border-richblack-400 border bg-richblack-800 px-[12px] py-1 text-richblack-5`}
            ref={ref}
          />
        )}

        {searchTerm && (
          <div
            className="text-white z-[1000]  absolute top-[10%] left-[8%]  mx-3 rounded-lg w-11/12 lg:w-9/11 lg:top-[30%]  bg-black border border-gray-600"
            onClick={(e) => e.stopPropagation()}
            ref={ref}
          >
            {open ? (
              <div className="py-2 pr-9">
                {results.length ? (
                  results.map((item, index) => (
                    <Link
                      to={`/question/${item._id}`}
                      onClick={() => {
                        setOpen(false);
                        isOpenInputField(false);
                        setSearchTerm("");
                      }}
                    >
                      <li
                        key={index}
                        className=" my-3 ml-3 text-white  flex items-center gap-2 hover:text-gray-300 hover:cursor-pointer"
                      >
                        <IoMdSearch />

                        {item.title}
                      </li>
                    </Link>
                  ))
                ) : (
                  <div className="py-2 px-7 text-center">No Result Found</div>
                )}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
