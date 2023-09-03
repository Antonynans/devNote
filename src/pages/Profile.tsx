import React from "react";
import { toast } from "react-toastify";
import { ChangeEvent, useState, FormEvent } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { AiOutlinePlus, AiOutlineArrowRight } from "react-icons/ai";
import Modal from "react-modal";
import emptyImage from "/noImg.svg";
import { useNavigate } from "react-router-dom";
import { Endpoints } from "../components/Endpoints";
import { UserData } from "../models/UserData";
import { useFetchUserData } from "../hooks/useFechData";
import book from "/book.svg";

interface ButtonDivProps {
  name: string | keyof UserData;
}

const Profile = () => {
  const userDetails = useSelector((state: RootState) => state.users);

  const [userInputs, setUserInputs] = useState<UserData>({
    email: "",
    username: "",
    picture: "",
    fullname: "",
  });
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const openModal = (name: string) => {
    setName(name);
    setModal(true);
  };
  const navigate = useNavigate();

  const closeModal = () => {
    setModal(false);
  };

  const { userData, setUserData } = useFetchUserData(userDetails);

  const handleOnChangeUserProfile = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInputs({ ...userInputs, [e.target.id]: e.target.value });
  };

  const handleUpdateUserProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: UserData = {
      [name as keyof UserData]: userInputs?.[name as keyof UserData],
    };

    try {
      await axios
        .patch(`${Endpoints.update_users}/${userDetails.user?._id}`, data)
        .then((res) => {
          setUserData(res.data);
          toast.success("You have successfully updated a user!");
          setModal(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    downloadUrl?: string
  ) => {
    e.preventDefault();
    const file = e.currentTarget.files?.[0];
    const upload_name = import.meta.env.VITE_CLOUDINARY_NAME;

    if (!file) {
      toast.error("No file selected");
      return;
    }

    const fileSize = file.size / 1024 / 1024;

    if (fileSize > 5) {
      toast.error("File size exceeds 5MB, please pick a smaller file");
    } else {
      toast.dark("Please wait...");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("api_secret", import.meta.env.VITE_CLOUDINARY_API_SECRET);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      await axios
        .post(`${Endpoints.uploadImage}${upload_name}/image/upload`, formData)
        .then((response) => {
          downloadUrl = response.data.secure_url;
          // toast.success('success')
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message);
        });

      const data = {
        picture: downloadUrl,
      };

      try {
        await axios
          .patch(`${Endpoints.update_users}/${userDetails.user?._id}`, data)
          .then((res) => {
            setUserData(res.data);
            toast.success(
              "You have successfully updated your profile picture!"
            );
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const ButtonDiv: React.FC<ButtonDivProps> = ({ name }) => {
    return (
      <button
        className="h-14 w-full rounded-[5px] text-left flex items-center gap-x-8"
        onClick={() => openModal(name)}
      >
        {userData?.[name as keyof UserData]}
        <AiOutlineArrowRight />
      </button>
    );
  };

  const ImageDiv = () => {
    return (
      <>
        <label className="flex justify-center cursor-pointer relative items-center">
          <div className="">
            {" "}
            <AiOutlinePlus className="absolute top-3 text-[#01CAB9] " />
          </div>
          <input
            type="file"
            className="visuallyHidden"
            accept=".png, .jpeg"
            onChange={handleImageUpload}
          />
        </label>
      </>
    );
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center bg-[#E5E5E5]">
        <div className="flex flex-col h-screen relative w-[500px] bg-white overflow-y-auto pb-20 px-8">
          <header className="flex items-center ">
            <div
              className="flex cursor-pointer items-center gap-4 my-12 "
              onClick={() => navigate("/")}
            >
              <img src={book} alt="book" />
              <p className="text-lg roboto">DevNote</p>
            </div>
          </header>
          <div className="flex  justify-between items-center">
            <div className="flex justify-between items-baseline pb-8">
              {userData?.picture ? (
                <div className="flex items-center">
                  <img
                    src={userData?.picture}
                    alt=""
                    className="w-16 h-16 rounded-full"
                  />
                  <ImageDiv />
                </div>
              ) : (
                <div className="w-16 h-16 p-2 rounded-full bg-[#F2F2F2] flex items-center justify-center">
                  <img
                    src={emptyImage}
                    alt="no image"
                    className="w-full h-full"
                  />
                  <ImageDiv />
                </div>
              )}
            </div>
          </div>

          <div>
            <p>User Information</p>
            <div className="flex items-center justify-between">
              <p className="w-full">Username</p> <ButtonDiv name="username" />
            </div>
            <div className="flex items-center justify-between">
              <p className="w-full">Fullname</p> <ButtonDiv name="fullname" />
            </div>
            <div className="flex items-center justify-between">
              <p className="w-full">Email</p> <ButtonDiv name="email" />
            </div>
          </div>
        </div>
      </div>
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
        className="absolute top-[10px] mx-auto rounded-[5px] lg:top-auto mt-[10vh] left-0 right-0 w-[500px] pb-12 overflow-y-auto overflow-auto bg-[#FFFDFD] z-50 outline-none border-0 flex flex-col justify-between shadow-[5px_5px_30px_0px_#00000040]"
        isOpen={modal}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <form
          onSubmit={handleUpdateUserProfile}
          className="flex flex-col items-center"
        >
          <input
            type={name === "email" ? "email" : "text"}
            placeholder={`| enter ${name}`}
            id={name}
            onChange={handleOnChangeUserProfile}
            className="h-14 w-full rounded-[5px] outline-none px-6"
          />
          <button className="bg-[#FB6900] text-white px-6 py-2 rounded-[5px] capitalize">
            Update {name}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Profile;
