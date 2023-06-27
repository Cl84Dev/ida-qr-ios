import { useRef, useState } from "react";

const useGoogleCloudAPI = () => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let mediaRecorderInstance = new MediaRecorder(stream);

      const audioChunks = [];
      mediaRecorderInstance.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderInstance.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

        const reader = new FileReader();
        reader.onloadend = async () => {
          const arrayBuffer = reader.result;
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // Conversão para o formato LINEAR16 (Substitua essa parte de acordo com sua abordagem)
          const linear16Array = convertToLinear16(audioBuffer);

          // Conversão para base64
          const base64String = arrayBufferToBase64(linear16Array);

          // Faz a chamada para a API do Google Cloud Speech-to-Text
          transcribeAudio(base64String);
        };

        reader.readAsArrayBuffer(audioBlob);
      });

      mediaRecorderInstance.start();
      setRecording(true);

      setTimeout(() => {
        mediaRecorderInstance.stop();
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao acessar o dispositivo de áudio:", error);
    }
  };

  const transcribeAudio = async (audioContent) => {
    try {
      fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "POST",
          body: JSON.stringify({
            config: {
              languageCode: "pt-BR",
              encoding: "LINEAR16",
              sampleRateHertz: 41000,
            },
            audio: {
              content: audioContent,
            },
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (!data.results) {
            textToSpeech(
              "Não foi enviado nenhum comando de voz. Toque na parte inferior da tela, aguarde o sinal sonoro e tente novamente."
            );
            return;
          }
          setTranscription(data.results[0].alternatives[0].transcript);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Erro na transcrição de voz:", error);
    }
  };

  // Função para converter o áudio para o formato LINEAR16 (Substitua essa função de acordo com sua abordagem)
  const convertToLinear16 = (audioBuffer) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const samples = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const buffer = new ArrayBuffer(samples * numberOfChannels * 2);
    const view = new DataView(buffer);
    let offset = 0;

    for (let sample = 0; sample < samples; sample++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const value = Math.max(
          -1,
          Math.min(1, audioBuffer.getChannelData(channel)[sample])
        );
        view.setInt16(
          offset,
          value < 0 ? value * 0x8000 : value * 0x7fff,
          true
        );
        offset += 2;
      }
    }
    return buffer; // Retorna o ArrayBuffer em vez de Uint8Array
  };

  const arrayBufferToBase64 = (arrayBuffer) => {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const textToSpeech = async (text) => {
    const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${
      import.meta.env.VITE_API_KEY
    }`;

    const requestData = {
      input: {
        text: text,
      },
      voice: {
        languageCode: "pt-BR",
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      const audioContent = data.audioContent;
      audioRef.current.src = `data:audio/mp3;base64,${audioContent}`;
      audioRef.current.play();
    } catch (error) {
      console.error(
        "Erro ao realizar a solicitação de conversão de texto em fala:",
        error
      );
    }
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

export default useGoogleCloudAPI;
