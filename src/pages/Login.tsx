import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUsers } from "../store/slice/getUsers";
import { Endpoints } from "../components/Endpoints";
import { ToastContainer, toast } from "react-toastify";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import FormInputs from "../components/FormInputs";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    setLoading(true);

    try {
      axios.post(Endpoints.login, values).then((res) => {
        dispatch(getUsers(res.data));
        navigate("/");
        setLoading(false);
        toast.success("Login successful!!");
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err);

        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
        }
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />

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

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="flex flex-col gap-4 mt-12"
            >
              <FormInputs label="Email" name="email" type="email" />
              <FormInputs label="Password" name="password" type="password" />

              <button
                disabled={loading}
                className={`bg-[#FB6900] text-white text-lg h-14 rounded-[5px] roboto" ${
                  loading && "opacity-50"
                }`}
              >
                Log in
              </button>
            </form>
          </FormProvider>

          <div className="flex justify-center items-center">
            <p
              className="roboto text-[#FB6900] text-center mt-4 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Not registered? Sign up here
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
