import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../store/context-values";

const query_generator = (query) => {
  return {
    query,
  };
};

function SuccessContainer() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;

  const [stories, setStories] = useState(null);
  const [addStoryVisible, setAddStoryVisible] = useState(false);
  const [newStoryContent, setNewStoryContent] = useState("");
  const [images, setImages] = useState([]);
  const [imageStrings, setImageStrings] = useState([]);
  const [imageVal, setImageVal] = useState(true);
  useEffect(() => {
    images.forEach((image) => {
      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => {
          setImageStrings((prevState) => [...prevState, reader.result]);
        };
      } else setImageVal(false);
    });
  }, [images]);
  useEffect(() => {
    if (!addStoryVisible) {
      setImageStrings([]);
      setImages([]);
      setNewStoryContent("");
    }
  }, [addStoryVisible]);
  const publishNewStory = async () => {
    setAddStoryVisible(false);
    setNotification_context({
      color: "blue",
      data: "Publishing...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
      mutation{
        publishStory(story:{content:"""${newStoryContent}""",image:${JSON.stringify(
        imageStrings
      )}})
        {
           _id
        }
       }
    `),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      setNotification_context({
        color: "red",
        data: "Something went wrong !",
      });
    } else {
      setNotification_context({
        color: "green",
        data: "Published !",
      });
      fetchStories();
    }
  };

  const fetchStories = useCallback(async () => {
    setNotification_context({
      color: "blue",
      data: "Getting latest data...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
            {
              stories{
                _id
                publish_date
                content
                image
              }
            }
          `),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      setNotification_context({
        color: "red",
        data: "Something went wrong !",
      });
    } else {
      setNotification_context({
        color: "green",
        data: "Data loaded !",
      });
      setStories(data.data.stories);
    }
  }, [setNotification_context, token]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);
  return (
    <div className="p-1 h-72 flex">
      {/* Notice Board */}
      <div className=" p-1 h-ful w-full flex justify-center items-center">
        {stories && stories.length < 1 && (
          <h2 className=" font-bold text-center">Empty !</h2>
        )}
        {stories && stories.length >= 1 && (
          <div className="border border-black flex w-full h-full flex-wrap overflow-y-auto">
            {stories.map((story) => (
              <div
                key={story._id}
                className="border border-neutral-800 m-1 p-1 flex flex-col w-48 h-56 rounded-md overflow-y-auto"
              >
                <span className="text-[0.6rem] font-semibold text-neutral-500 border-b border-slate-200 pb-[0.10rem]">
                  {story.publish_date}
                </span>
                {story.image.length >= 1 && (
                  <div className="w-full flex flex-row flex-wrap">
                    {story.image.map((img) => (
                      <img key={img} className="w-full" src={img} alt="img" />
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-line text-xs">
                  {story.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Add New notice */}
      {addStoryVisible && (
        <div className="border p-1 h-full border-black rounded-md w-64 flex flex-col items-center overflow-y-auto">
          <textarea
            onChange={(event) => setNewStoryContent(event.target.value)}
            minLength={10}
            rows={10}
            cols={30}
            className="border border-slate-500 rounded-md text-xs p-1 mb-2"
            placeholder="Type here..."
          ></textarea>
          {newStoryContent.trim().length > 10 && (
            <div className="flex flex-col justify-center items-start gap-2">
              <div className="flex flex-wrap justify-center items-start gap-2">
                <input
                  multiple
                  className="text-[0.6rem]"
                  type="file"
                  onChange={(e) => setImages([...e.target.files])}
                  accept="image/*"
                ></input>
                {imageStrings.length >= 1 &&
                  imageStrings.map((img) => (
                    <img
                      src={img}
                      alt="img not found"
                      className="text-[0.4rem] w-16 h-16"
                    />
                  ))}
              </div>
              {imageVal && (
                <button
                  onClick={publishNewStory}
                  className="border border-black-300 text-xs font-bold p-1 rounded-md"
                >
                  Publish
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {/* Toggle visibility */}
      <button
        onClick={() => setAddStoryVisible(!addStoryVisible)}
        className="border border-black-300 text-xs font-bold w-auto px-1 mx-1 h-5"
      >
        {addStoryVisible ? "Close" : "+"}
      </button>
    </div>
  );
}

export default SuccessContainer;
