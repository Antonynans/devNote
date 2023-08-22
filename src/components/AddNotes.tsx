import { FormEvent, useState } from "react";
import line from "/line.svg";
import { ChangeEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Endpoints } from "./Endpoints";

interface Note {
  _id?: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  getForm: () => void;
  setModal: (modal: boolean) => void;
  isEdit: boolean;
  note: Note;
}

const AddNotes: React.FC<Props> = ({ getForm, setModal, isEdit, note }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleContentChange = (event: ChangeEvent<HTMLDivElement>) => {
    setDescription(event.target.textContent || "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newNotes = { ...{ title, description } };

    if (!isEdit) {
      if (!title && !description) {
        toast.warn("Fill in your title and description or close the form!");
      } else if (!title && description) {
        toast.warn("Fill in your title!");
      } else if (title && !description) {
        toast.warn("Fill in your description!");
      } else {
        try {
          await axios.post(Endpoints.create_form, newNotes).then((res) => {
            console.log(res.data);
            getForm();
            toast.success("You have successfully added a new note!");
            setModal(false);
            setTitle("");
            setDescription("");
          });
        } catch (error: unknown) {
          console.log(error);
          toast.error("Error creating a note");
        }
      }
    } else {
      try {
        await axios
          .patch(`${Endpoints.update_form}/${note?._id}`, newNotes)
          .then((res) => {
            console.log(res.data);
            getForm();
            toast.success("You have successfully updated a note!");
            setModal(false);
          });
      } catch (err) {
        console.log(err);
        toast.error("Error updating a note");
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <form onSubmit={handleSubmit} className="">
        <div className="">
          <input
            type="text"
            placeholder="| Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-14 w-full rounded-[5px] outline-none px-6"
          />
        </div>
        <img src={line} alt="" className="mb-2 mt-3 w-full" />

        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          className="w-full min-h-14 max-h-40 overflow-auto px-6 outline-none  rounded-[5px] cursor-text"
          contentEditable="true"
          data-text="| Description"
          onInput={handleContentChange}
        ></div>

        <div className="flex justify-end pr-6 mt-8">
          <button className="bg-[#FB6900] text-white px-6 py-2 rounded-[5px] ">
            {isEdit ? "Modify" : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};
export default AddNotes;
