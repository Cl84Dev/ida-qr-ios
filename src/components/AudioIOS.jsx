import QrCodeGrid from "./QrCodeGrid.jsx";
import styles from "./AudioIOS.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "@nextui-org/react";
import QRCodeScanner from "./QrCodeScanner.jsx";
import useGoogleCloudAPI from "../../hooks/useGoogleCloudAPI.jsx";

const AudioIOS = () => {
  const [data, setData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const {
    transcription,
    setTranscription,
    recording,
    audioRef,
    startRecording,
    textToSpeech,
  } = useGoogleCloudAPI();

  useEffect(() => {
    if (transcription) {
      switch (transcription) {
        case "áudio": {
          axios
            .get(`${import.meta.env.VITE_DB_URL}/obra/?q=${data}`)
            .then((res) => {
              audioRef.current.src = `${import.meta.env.VITE_R_DB_URL}${
                res.data.audio
              }`;
              audioRef.current.currentTime = 0;
              audioRef.current.addEventListener("ended", () => {
                setPlaying(false);
              });
              audioRef.current.play();
              setPlaying(true);
              setTranscription(null);
            })
            .catch((err) => {
              textToSpeech(
                "Áudio não encontrado. Leia um q r code para iniciar."
              );
              console.log(err);
              setTranscription(null);
            });
          break;
        }
        case "prossiga": {
          handler();
          setData(null);
          setTranscription(null);
          break;
        }
        default: {
          axios
            .get(
              `${import.meta.env.VITE_DB_URL}/subcomando/?q=${transcription}`
            )
            .then((res) => {
              audioRef.current.src = res.data.audio;
              audioRef.current.currentTime = 0;
              audioRef.current.addEventListener("ended", () => {
                setPlaying(false);
              });
              audioRef.current.play();
              setPlaying(true);
              setTranscription(null);
            })
            .catch((err) => {
              textToSpeech(
                `${transcription} não é um comando válido. Toque na parte inferior da tela, aguarde o sinal sonoro e diga um comando.`
              );
              console.log(err);
              setTranscription(null);
            });
        }
      }
    }
  }, [transcription]);

  const handler = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setScannerVisible(true);
  };

  const closeHandler = () => {
    setScannerVisible(false);
  };

  const handleScan = (e) => {
    setData(e);
    axios
      .get(`${import.meta.env.VITE_DB_URL}/obra/?q=${e}`)
      .then((res) => {
        textToSpeech(res.data.descricao_obra);
      })
      .catch((err) => {
        textToSpeech("Q R code não reconhecido.");
        console.log(err);
      });

    closeHandler();
  };

  const handleSpeechRecognition = () => {
    audioRef.current.src = "/assets/audios/bip.mp3";
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setTimeout(() => {
      startRecording();
    }, 1000);
  };

  const stopAudio = (e) => {
    e.stopPropagation();
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
  };

  const handleFirstClick = () => {
    textToSpeech("Leia um q r code para iniciar a navegação por voz.");
    setFirstClick(false);
  };

  return (
    <div
      className={styles.container}
      onClick={firstClick ? handleFirstClick : handleSpeechRecognition}
    >
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={scannerVisible}
        onClose={closeHandler}
        css={{
          borderRadius: "0",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <QRCodeScanner
          onScan={(e) => handleScan(e)}
          onError={(e) => console.log(e)}
        />
      </Modal>
      <QrCodeGrid onClick={firstClick ? handleFirstClick : (e) => handler(e)} />
      {playing && (
        <img
          onClick={(e) => stopAudio(e)}
          src="/assets/images/stop.svg"
          alt="Stop"
          style={{
            width: "120px",
            position: "absolute",
            transform: "translateY(-200%)",
          }}
        />
      )}
      <img src="/assets/images/logo-expo.png" alt="Logo" />
      <div className={recording ? styles.recording : styles.notRecording}>
        <img src="/assets/images/icone-audio.png" alt="Audio" />
      </div>
      <img src="/assets/images/logo-museu---branco.png" alt="Logo" />
      <audio ref={audioRef} />
    </div>
  );
};

export default AudioIOS;
