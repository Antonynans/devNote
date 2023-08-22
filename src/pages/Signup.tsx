import { useState } from "react";
import CreateAccount from "../components/CreateAccount";
import Verify from "../components/verify";

export default function Signup() {
  const [isVerify, setIsVerify] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="w-full h-screen flex justify-center bg-[#E5E5E5] ">
      <main className="flex flex-col h-screen relative w-[500px] bg-white overflow-y-auto pb-20 px-8">
        <header className="flex items-center gap-4 mt-12">
          <img src="/book.svg" alt="book" />
          <p className="text-lg roboto">DevNote</p>
        </header>
        {isVerify ? (
          <Verify email={email} />
        ) : (
          <CreateAccount setIsverify={setIsVerify} setEmail={setEmail} />
        )}
      </main>
    </div>
  );
}
