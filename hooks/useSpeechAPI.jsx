import { useRef, useState } from "react";

const useSpeechAPI = () => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const audioRef = useRef(null);

  const startRecording = () => {
    const recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.start();

    recognition.onerror = function (event) {
      console.error(event.error);
      if (event.error) {
        textToSpeech(
          "Não foi enviado nenhum comando de voz. Toque na parte inferior da tela, aguarde o sinal sonoro e diga um comando."
        );
        setRecording(false);
        recognition.stop();
      }
    };

    recognition.onresult = async function (event) {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const content = event.results[i][0].transcript.trim();
          if (content === "") {
            textToSpeech(
              "Não foi enviado nenhum comando de voz. Toque na parte inferior da tela, aguarde o sinal sonoro e diga um comando."
            );
            setRecording(false);
            recognition.stop();
          } else {
            setTranscription(content);
            setRecording(false);
            recognition.stop();
          }
        }
      }
    };

    setRecording(true);
  };

  const textToSpeech = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return {
    transcription,
    setTranscription,
    recording,
    audioRef,
    startRecording,
    textToSpeech,
  };
};

export default useSpeechAPI;
