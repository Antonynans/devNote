import axios from "axios";
import { createAccountFn } from "./Endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import FormInputs from "./FormInputs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { getloaderstate } from "../store/slice/loaderstate";
import { useMutation } from "@tanstack/react-query";

interface Props {
  setIsverify: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const registerSchema = object({
  username: string().min(1, "Username is required").max(100),
  fullname: string().min(1, "Name is required").max(100),
  email: string()
    .min(1, "Email address is required")
    .toLowerCase()
    .trim()
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

export type RegisterInput = TypeOf<typeof registerSchema>;

const CreateAccount: React.FC<Props> = ({ setIsverify, setEmail }) => {
  const loading = useSelector((state: RootState) => state.loader);

  const dispatch = useDispatch();

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const { handleSubmit } = methods;

  const { mutate: registerUser } = useMutation(
    (userData: RegisterInput) => createAccountFn(userData),
    {
      onMutate() {
        dispatch(getloaderstate(true));
      },
      onSuccess(data) {
        dispatch(getloaderstate(false));
        setIsverify(true);

        setEmail(data?.user?.email);
        toast.success("Check email address for OTP");
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

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    registerUser(values);
  };

  return (
    <>
      <div className="mt-12">
        <img src="/hero.svg" alt="" className="w-full" />
        <p className="text-lg roboto text-center">Sign up</p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="flex flex-col gap-4 mt-12"
        >
          <FormInputs label="User Name" name="username" />
          <FormInputs label="Full Name" name="fullname" />
          <FormInputs label="Email" name="email" type="email" />
          <FormInputs label="Password" name="password" type="password" />
          <FormInputs
            label="Confirm Password"
            name="passwordConfirm"
            type="password"
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
      </FormProvider>

      <div className="flex justify-center items-center">
        <p
          className="roboto text-[#FB6900] text-center mt-4 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Registered? Login here
        </p>
      </div>
    </>
  );
};

export default CreateAccount;
