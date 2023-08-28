import { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-modal";
import AddNotes from "../components/AddNotes";
import Notes from "../components/Notes";
import axios from "axios";
import Loader from "../components/whiteloader";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { Endpoints } from "../components/Endpoints";

interface Note {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Home() {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [notes, setNotes] = useState<any>([]);

  const [modal, setModal] = useState(false);

  const getToken = sessionStorage.getItem("saved_devnote");

  console.log(notes, "user");

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = filteredNotes?.filter((data) => {
        return (
          data.title?.toLowerCase().includes(keyword.toLowerCase()) ||
          data.description?.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      setNotes(results);
    } else {
      setNotes(filteredNotes);
    }
  };

  const getForm = () => {
    try {
      axios
        .get(Endpoints.get_form, {
          headers: {
            Authorization: `Bearer ${getToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setNotes(res.data);
          setFilteredNotes(res.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(getForm, []);

  const deleteNotes = async (id: string | undefined) => {
    try {
      const deleteNotes = notes.filter(
        (note: { _id: string | undefined }) => note._id !== id
      );
      setNotes(deleteNotes);
      toast.success("You have successfully deleted a note!");
      await axios.delete(`${Endpoints.delete_form}/${id}`).then(() => {
        console.log("Form deleted successfully");
        getForm();
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {notes ? (
        <div className="w-full h-screen flex justify-center bg-[#E5E5E5]">
          <main className="flex flex-col h-screen relative w-[500px] bg-white overflow-y-auto pb-20">
            <div>
              <Header />

              <div className="px-6 mt-4">
                <input
                  className="border border-[#FA9F5E] rounded-full h-14 w-full px-6 outline-none"
                  placeholder="Search..."
                  onChange={(event) => handleSearch(event)}
                />
              </div>
            </div>
            <section className="px-6">
              {notes.length > 0 ? (
                <Notes notes={notes} onDelete={deleteNotes} getForm={getForm} />
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p className="text-center">No items to display</p>
                </div>
              )}
            </section>

            <footer className="flex justify-end pr-6 ">
              <button
                className="rounded-full bg-[#FB6900] text-white w-12 h-12 flex justify-center items-center fixed bottom-24"
                onClick={openModal}
              >
                <img src="/plus.svg" alt="" />
              </button>
            </footer>
          </main>
        </div>
      ) : (
        <Loader />
      )}

      <Modal
        style={{
          overlay: {
            position: "fixed",
            top: "0%",
            left: "0%",
            right: "0%",
            bottom: "0%",
            backgroundColor: "#00000078",
            zIndex: 100,
          },
        }}
        className="absolute top-[100px] mx-4 rounded-[5px] lg:top-auto mt-[30vh] left-0 lg:left-[35%] lg:right-[35%] right-0 h-auto pb-12 overflow-y-auto overflow-auto bg-[#FFFDFD] z-50 outline-none border-0 flex flex-col justify-between shadow-[5px_5px_30px_0px_#00000040]"
        isOpen={modal}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <AddNotes
          getForm={getForm}
          setModal={setModal}
          isEdit={false}
          note={notes}
        />
      </Modal>
    </>
  );
}
