import WelcomePage from "./WelcomePage";
import { useState } from "react";
import Verify from "./Verify";

interface Props {
  email: string;
}

const Index: React.FC<Props> = ({ email }) => {
  const [isWelcomePage, setIsWelcomePage] = useState(false);

  return (
    <>
      {isWelcomePage ? (
        <WelcomePage />
      ) : (
        <Verify email={email} setIsWelcomePage={setIsWelcomePage} />
      )}
    </>
  );
};

export default Index;
