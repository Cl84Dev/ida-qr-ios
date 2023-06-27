import { useState, useEffect } from "react";
import AudioAndroid from "./components/AudioAndroid";
import AudioIOS from "./components/AudioIOS";

const Audio = () => {
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);
  return (
    <>
      {/* {isIOS ? <AudioIOS /> : <AudioAndroid />} */}
      <AudioIOS />
    </>
  );
};

export default Audio;
