import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUsers } from "../store/slice/getUsers";
import { Endpoints } from "../components/Endpoints";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      email: inputs.email,
      password: inputs.password,
    };

    try {
      await axios.post(Endpoints.login, data).then((res) => {
        console.log(res.data.token);

        dispatch(getUsers(res.data));

        navigate("/");
        setLoading(false);
        alert("Login successful!!");
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center bg-[#E5E5E5]">
      <main className="w-[500px] bg-white px-6 overflow-y-scroll pb-20">
        <header className="flex items-center gap-4 mt-12">
          <img src="/book.svg" alt="book" />
          <p className="text-lg roboto">DevNote</p>
        </header>

        <div className="mt-12">
          <img src="/hero.svg" alt="" className="w-full" />
          <p className="text-lg roboto text-center">Log in</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-12">
          <input
            type="email"
            placeholder="Email address"
            id="email"
            onChange={onChangeHandler}
            required
            className="h-14 border border-[#FB6900] rounded-[5px] outline-none px-6"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={onChangeHandler}
            id="password"
            required
            minLength={8}
            className="h-14 border border-[#FB6900] rounded-[5px] outline-none px-6"
          />
          <button
            disabled={loading}
            className={`bg-[#FB6900] text-white text-lg h-14 rounded-[5px] roboto" ${
              loading && "opacity-50"
            }`}
          >
            Log in
          </button>
        </form>
        {/* <div className="flex justify-center items-center py-8">
          <p className="text-2xl"> or </p>
        </div> */}

        {/* <GoogleLogin
          onSuccess={responseMessage}
          onError={() => {
            console.log("Login failed");
          }}
        /> */}
        <div className="flex justify-center items-center">
          <a href="/signup" className="roboto text-[#FB6900] text-center mt-4">
            Not registered? Sign up here
          </a>
        </div>
      </main>
    </div>
  );
}
