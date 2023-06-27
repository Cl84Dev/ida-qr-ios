import QrCodeGrid from "./components/QrCodeGrid";
import styles from "./Libras.module.css";
import { Modal } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import QRCodeScanner from "./components/QrCodeScanner";

const Libras = () => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [data, setData] = useState(null);
  const [videoReceived, setVideoReceived] = useState("");
  const videoRef = useRef();

  const handler = () => {
    setScannerVisible(true);
  };

  const closeHandler = () => {
    setScannerVisible(false);
  };

  const closeVideoHandler = () => {
    setVideoVisible(false);
    setData(false);
  };

  const handleScan = (e) => {
    setData(e);
  };

  const openFullscreen = () => {
    videoRef.current.requestFullscreen();
  };

  useEffect(() => {
    if (data) {
      axios
        .get(`${import.meta.env.VITE_DB_URL}/obra/?q=${data}`)
        .then((res) =>
          setVideoReceived(`${import.meta.env.VITE_R_DB_URL}${res.data.video}`)
        )
        .catch((err) => {
          closeHandler();
          closeVideoHandler();
          console.log(err);
        });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setScannerVisible(false);
      setVideoVisible(true);
    }
  }, [data]);

  return (
    <div className={styles.container} onClick={handler}>
      <Modal
        aria-labelledby="modal-title"
        open={scannerVisible}
        closeButton
        preventClose
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
      <Modal
        aria-labelledby="modal-title"
        open={videoVisible}
        closeButton
        onClose={closeVideoHandler}
        fullScreen
        css={{
          borderRadius: "0",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        {videoReceived && (
          <>
            <img
              src="/assets/images/fullscreen.svg"
              alt="fullscreen"
              style={{ width: "30px", margin: "0 auto" }}
              onClick={openFullscreen}
            />
            <video
              src={videoReceived}
              controls
              autoPlay
              ref={videoRef}
              className={styles.video}
            ></video>
            <Modal.Footer>
              <img
                src="/assets/images/botao-libras.png"
                alt="Libras"
                style={{ height: "90px", margin: "30px auto" }}
                onClick={closeVideoHandler}
              />
            </Modal.Footer>
          </>
        )}
      </Modal>
      <QrCodeGrid />
      <img src="/assets/images/logo-expo.png" alt="Logo" />
      <img
        src="/assets/images/icone-libras.png"
        alt="Libras"
        onClick={handler}
      />
      <img src="/assets/images/logo-museu---branco.png" alt="Logo" />
    </div>
  );
};

export default Libras;
