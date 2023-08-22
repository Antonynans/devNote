import book from "/book.svg";
import emptyImage from "/noImg.svg";
import line from "/line.svg";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";
import storage from "redux-persist/lib/storage";
import { useNavigate } from "react-router-dom";
import { Endpoints } from "./Endpoints";
import { useFetchUserData } from "../hooks/useFechData";

const Header = () => {
  const userDetails = useSelector((state: RootState) => state.users);
  const { userData } = useFetchUserData(userDetails);

  const navigate = useNavigate();

  const handleLogout = async () => {
    window.location.pathname = "/login";
    storage.removeItem("persist:root");
    await axios.post(Endpoints.logout);
  };

  const Transitions = () => {
    return (
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 w-max rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none mt-2">
          <div className="py-1 flex flex-col">
            <Menu.Item>
              {({ active }) => (
                <span
                  className={`flex items-center px-4 py-2 cursor-pointer ${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`}
                  onClick={() => navigate("/profile")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M6.25 5.41667C6.25 7.48417 7.9325 9.16667 10 9.16667C12.0675 9.16667 13.75 7.48417 13.75 5.41667C13.75 3.34917 12.0675 1.66667 10 1.66667C7.9325 1.66667 6.25 3.34917 6.25 5.41667ZM16.6667 17.5H17.5V16.6667C17.5 13.4508 14.8825 10.8333 11.6667 10.8333H8.33333C5.11667 10.8333 2.5 13.4508 2.5 16.6667V17.5H16.6667Z"
                      fill="#828282"
                    />
                  </svg>
                  &nbsp; My Profile
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  className={`flex items-center px-4 py-2 cursor-pointer ${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`}
                  onClick={handleLogout}
                >
                  <svg
                    width="18"
                    height="18"
                    className="w-4 h-4"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0C4.037 0 0 4.037 0 9V9.001L5 5.001V8.001H12V10.001H5V13.001L0 9.001C0.001 13.964 4.037 18 9 18C13.963 18 18 13.963 18 9C18 4.037 13.963 0 9 0Z"
                      fill="#828282"
                    />
                  </svg>{" "}
                  &nbsp; Logout
                </span>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    );
  };

  return (
    <>
      <header>
        <span className="flex items-center mt-8 justify-between px-4">
          <div className="flex items-center gap-4">
            <img src={book} alt="book" className="w-7 h-7" />
            <p>Notes by {userDetails?.user?.username}</p>
          </div>
          <div className=" flex items-center gap-3 relative">
            <Menu as="div" className=" inline-block text-right w-full">
              <Menu.Button className="flex items-center justify-between w-full gap-x-2">
                {userData?.picture ? (
                  <img
                    src={userData.picture}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 p-2 rounded-full bg-[#F2F2F2] flex items-center justify-center">
                    <img src={emptyImage} alt="no image" className="w-full h-full" />
                  </div>
                )}
              </Menu.Button>
              <Transitions />
            </Menu>
          </div>
        </span>

        <img src={line} alt="" className="mb-2 mt-3 w-full" />
        <img src={line} alt="" className="w-full" />
      </header>
    </>
  );
};

export default Header;
