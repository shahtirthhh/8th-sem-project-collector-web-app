import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Context } from "../../../store/context-values";

const query_generator = (query) => {
  return {
    query,
  };
};

function Notes() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;

  const [notes, setNotes] = useState(null);
  const [addNoteVisible, setAddNoteVisible] = useState(false);
  const [newNoteData, setNewNoteData] = useState("");

  const deleteNote = async (id) => {
    setNotification_context({
      color: "blue",
      data: "📤 Deleting...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            deleteNote(id:"${id}"){
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
        data: "☠ Something went wrong !",
      });
    } else if (data.data.deleteNote) {
      setNotification_context({
        color: "green",
        data: "🗑 Deleted !",
      });
      fetchNotes();
    }
  };
  const saveNewNote = async () => {
    setNotification_context({
      color: "blue",
      data: "💾 Saving...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            saveNote(note:{content:"""${newNoteData}"""}){
              _id
              content
            }
          }
        `),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      setNewNoteData("");
      setNotification_context({
        color: "red",
        data: "☠ Something went wrong !",
      });
    } else if (data.data.saveNote) {
      setNotification_context({
        color: "green",
        data: "👍🏻 saved !",
      });
      setNewNoteData("");
      fetchNotes();
    }
    setAddNoteVisible(false);
  };
  const fetchNotes = useMemo(() => {
    return async () => {
      const { data } = await axios({
        method: "post", //you can set what request you want to be
        url: process.env.REACT_APP_API,
        data: query_generator(`
            {
              notes{
                _id
                content
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
          data: "☠ Something went wrong !",
        });
      } else {
        setNotes(data.data.notes);
      }
    };
  }, []);
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="border-2 border-black  p-1 w-[33.33%] flex rounded-[2rem] bg-amber-50  flex-col justify-start items-center">
      {!notes && <h2 className="font-bold text-center">💀 Error !</h2>}
      {notes && notes.length >= 1 && (
        <ul className="p-3 mt-4 flex flex-col w-full h-[20rem] overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent ">
          {notes.map((note) => (
            <div key={note._id} className="flex flex-row justify-between">
              <li
                className=" text-lg font-medium p-1 whitespace-pre-line tracking-wide"
                onDoubleClick={() => deleteNote(note._id)}
              >
                👉🏻 {note.content}
              </li>
            </div>
          ))}
        </ul>
      )}
      <div className="flex gap-5 mt-4">
        <button
          onClick={() => {
            setAddNoteVisible(!addNoteVisible);
            setNewNoteData("");
          }}
          className={`transition-all hover:scale-105  text-base rounded-xl font-bold w-auto px-2 py-1 ${
            addNoteVisible
              ? "bg-red-400 hover:bg-red-500  border-2 border-red-600"
              : "hover:bg-yellow-400  border-2 border-yellow-500"
          }`}
        >
          {addNoteVisible ? "Close 📕" : "New note 📝"}
        </button>
        {addNoteVisible && newNoteData.trim().length >= 5 && (
          <button
            onClick={saveNewNote}
            className="hover:scale-105 hover:bg-green-500 bg-green-300 transition-all border-2 border-green-600 text-base rounded-xl font-bold w-auto px-2 py-1"
          >
            Save 💾
          </button>
        )}
      </div>

      {addNoteVisible && (
        <textarea
          className="border-2 border-black rounded-xl m-4 font-medium text-base p-2 w-60 scrollbar scrollbar-thumb-slate-800  scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent "
          onChange={(event) => setNewNoteData(event.target.value)}
          minLength={5}
          rows={5}
          cols={30}
        ></textarea>
      )}
    </div>
  );
}

export default Notes;
