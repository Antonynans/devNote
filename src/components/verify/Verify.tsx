import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Endpoints } from "../Endpoints";

interface Props {
  email: string;
  setIsWelcomePage: React.Dispatch<React.SetStateAction<boolean>>;
}

const Verify: React.FC<Props> = ({ email, setIsWelcomePage }) => {
  const [counter, setCounter] = useState<number>(120);
  const [loading, setLoading] = useState(false);
  const [disableInput, setDisableInput] = useState(false);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpData = otp.join("");

  const handleChangeOtp = (
    element: HTMLInputElement,
    index: number
  ): boolean => {
    if (isNaN(Number(element.value))) return false;

    setOtp((prevOtp) => [
      ...prevOtp.map((d, idx) => (idx === index ? element.value : d)),
    ]);

    if (element.nextSibling instanceof HTMLInputElement) {
      element.nextSibling.focus();
    }

    return true;
  };

  useEffect(() => {
    if (email) {
      const timer: NodeJS.Timeout | null =
        counter > 0 ? setInterval(() => setCounter(counter - 1), 1000) : null;

      return () => {
        if (timer) {
          clearInterval(timer);
        }
      };
    }
  }, [counter, email]);

  const retryConfirmVerify = () => {
    setOtp(new Array(6).fill(""));
    setLoading(true);

    setCounter(120);
  };

  useEffect(() => {
    const handleSubmitVerifyAccount = async () => {
      if (otpData.length === 6) {
        setDisableInput(true);
        setLoading(true);

        const data = {
          otp: otpData,
          email: email,
        };
        try {
          await axios
            .post(Endpoints.verifyOtp, data)
            .then((res) => {
              toast.success(res.data.message);
              setLoading(false);
              setDisableInput(false);
              setIsWelcomePage(true);
            })
            .catch((err) => {
              toast.error(err.response?.data?.message);
              setLoading(false);
              setDisableInput(false);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleSubmitVerifyAccount();
  }, [email, otpData]);

  return (
    <>
      <div className="mt-8">
        <div className=" container flex flex-col m-auto ">
          <p className="text-2xl font-medium text-center">
            Validate your account.
          </p>

          <div className=" bg-[#E8FFFD] border border-solid border-[#01CAB9] text-[#828282] font-fontMono font-[14px] mt-8 flex flex-col items-center justify-center p-6 text-center">
            Enter validation code sent to
            <p className="truncate w-full">{email}</p>
          </div>
          <div className="font-prompt text-[14px] flex items-center justify-center mt-[15%] mb-[2%]">
            <p>
              Code expires in <span className="text-[#01CAB9]">{counter}s</span>
            </p>
          </div>
          <form>
            <div className="flex w-full m-auto justify-center">
              {otp.map((data, index) => {
                return (
                  <input
                    className="w-12 h-12 rounded-sm border border-[#BDBDBD] outline-none m-2 text-center"
                    type="text"
                    name="otp"
                    disabled={disableInput}
                    key={index}
                    value={data}
                    onChange={(e) => handleChangeOtp(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                );
              })}
            </div>
          </form>

          {loading ? (
            <div className="flex items-center justify-center m-[3%] font-light">
              <img className="animate-spin" src="/loading.svg" alt="" />
              &nbsp; Verifying...
            </div>
          ) : (
            ""
          )}

          <div className="font-prompt text-[14px] flex items-center justify-center mt-[3%]">
            {counter <= 0 && (
              <p>
                Did not receive code?{" "}
                <span
                  className="text-[#01CAB9] cursor-pointer"
                  onClick={retryConfirmVerify}
                >
                  Retry.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Verify;
