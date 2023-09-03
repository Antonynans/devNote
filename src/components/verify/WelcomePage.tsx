import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full py-[3.4rem] px-[5%] ">
        <div className=" container flex flex-col m-auto ">
          <p className="font-medium text-[#4F4F4F] text-2xl m-auto">
            Congratulations
          </p>
          <img src="/logoLogin.svg" alt="" className="m-auto mt-[15%]" />
          <p className="font-fontMono text-[#4F4F4F] m-auto mt-[10%] text-center">
            Welcome onboard, time to create your notes.
          </p>
          <button
            className="bg-[#FB6900] h-[3.25rem] rounded-sm text-white font-medium m-auto mt-[10%] w-2/3 transition ease-in-out delay-150 hover:scale-105"
            onClick={() => navigate("/login")}
          >
            Go to login
          </button>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
