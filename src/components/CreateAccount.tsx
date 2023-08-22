import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Endpoints } from "./Endpoints";
import { toast } from "react-toastify";

interface Props {
  setIsverify: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const CreateAccount: React.FC<Props> = ({ setIsverify, setEmail }) => {
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  // const navigate = useNavigate();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  };

  console.log(inputs.email, "emails");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(Endpoints.signup, inputs).then((res) => {
        console.log(res.data);
        setLoading(false);
        setIsverify(true);
        setEmail(inputs.email);
        toast.success("Check email address for OTP");
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-12">
        <img src="/hero.svg" alt="" className="w-full" />
        <p className="text-lg roboto text-center">Sign up</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-12">
        <input
          type="text"
          placeholder="First name"
          id="firstname"
          onChange={onChangeHandler}
          required
          className="h-14 border border-[#FB6900] rounded-[5px] outline-none px-6"
        />
        <input
          type="text"
          placeholder="Last name"
          id="lastname"
          onChange={onChangeHandler}
          required
          className="h-14 border border-[#FB6900] rounded-[5px] outline-none px-6"
        />
        <input
          type="email"
          id="email"
          placeholder="Email address"
          onChange={onChangeHandler}
          required
          className="h-14 border border-[#FB6900] rounded-[5px] outline-none px-6"
        />
        <input
          type="password"
          value={inputs.password}
          id="password"
          placeholder="Password"
          onChange={onChangeHandler}
          required
          className="h-14 border border-[#FB6900] rounded-[5px] outline-none px-6"
        />
        <button
          disabled={loading}
          className={`bg-[#FB6900] text-white text-lg h-14 rounded-[5px] roboto" ${
            loading && "opacity-50"
          }`}
        >
          Sign up
        </button>
      </form>

      <div className="flex justify-center items-center">
        <a href="/login" className="roboto text-[#FB6900] text-center mt-4">
          Registered? Login here
        </a>
      </div>
    </>
  );
};

export default CreateAccount;
