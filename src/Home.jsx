import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import useGoogleCloudAPI from "../hooks/useGoogleCloudAPI";

const Home = () => {
  const [played, setPlayed] = useState(false);
  const navigate = useNavigate();
  const { audioRef, textToSpeech } = useGoogleCloudAPI();

  const handleClick = () => {
    if (played) {
      navigate("/audio");
    } else {
      axios
        .get(`${import.meta.env.VITE_DB_URL}/inicio/`)
        .then((res) => {
          if (res.data[0].audio_text) {
            audioRef.current.src = res.data[0].audio_start;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            textToSpeech(res.data[0].texto);
          }
          setPlayed(true);
        })
        .catch((err) => {
          console.log(err);
          const speechSynthesis = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(
            "Algo saiu errado. Tente novamente."
          );
          speechSynthesis.speak(utterance);
        });
    }
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <img src="/assets/images/logo-expo.png" alt="Logo" />
      <Link to="/libras">
        <img
          src="/assets/images/botao-libras.png"
          alt="Libras"
          onClick={(e) => e.stopPropagation()}
        />
      </Link>
      <img src="/assets/images/logo-museu.png" alt="Logo" />
      <img src="/assets/images/logo-mover.png" alt="Logo" />
      <audio ref={audioRef} />
    </div>
  );
};

export default Home;
