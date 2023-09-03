import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../store/slice/getUsers";
import { loginUserFn } from "../components/Endpoints";
import { toast } from "react-toastify";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import FormInputs from "../components/FormInputs";
import { RootState } from "../store/Store";
import { getloaderstate } from "../store/slice/loaderstate";
import { useMutation } from "@tanstack/react-query";

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
  const loading = useSelector((state: RootState) => state.loader);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = methods;

  const { mutate: loginUser } = useMutation(
    (userData: LoginInput) => loginUserFn(userData),
    {
      onMutate() {
        dispatch(getloaderstate(true));
      },
      onSuccess(data) {
        dispatch(getloaderstate(false));
        dispatch(getUsers(data));
        navigate("/");
        toast.success("Login successful!!");
      },
      onError(err) {
        if (axios.isAxiosError(err)) {
          console.error(err);

          if (err.response?.data?.message) {
            toast.error(err.response.data.message);
          }
        } else {
          console.error(err);
        }
      },
      onSettled() {
        dispatch(getloaderstate(false));
      },
    }
  );

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values);
  };

  return (
    <>
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
