import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const QRCodeScanner = ({ onScan, onError }) => {
  const webcamRef = useRef(null);

  const handleScan = () => {
    const video = webcamRef.current.video;

    if (
      video.readyState === video.HAVE_ENOUGH_DATA &&
      video.videoWidth > 0 &&
      video.videoHeight > 0
    ) {
      const canvas = document.createElement("canvas");
      const canvasContext = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvasContext.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        onScan(code.data);
      } else {
        onError("QR code não encontrado");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(handleScan, 1000);

    return () => clearInterval(interval);
  }, []);

  const videoConstraints = {
    facingMode: "environment",
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        mirrored={false}
        style={{ width: "100%", height: "auto" }}
        videoConstraints={videoConstraints}
      />
    </div>
  );
};

export default QRCodeScanner;
