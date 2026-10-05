//Start Microphone
//Convert Speech to Text
//Detect 3s pause/ silence
//automatically call a callback function
//Speech recognition

// import {useState, useRef, useEffect} from "react";



// export const useSpeechToText = (onSilence) => { 
//     const recognitionRef = useRef(""); //SpeechRecognition 
//     const silenceTimeoutRef = useRef(""); 
//     const onSilenceRef = useRef(onSilence); 
//     const transcriptRef = useRef(""); 
//     const [transcript, setTranscript] = useState("");
    
//     useEffect(() => {
//     onSilenceRef.current = onSilence;
//   }, [onSilence]);

//     useEffect(() => {
//     transcriptRef.current = transcript;
//   }, [transcript]);

//     const startListening = () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) {
//             console.error("Speech Recognition is not supported in this browser");
//             return;
//         }

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognition.lang = "en-US";

//         recognition.onresult = (event) => {
//            let finalText = "";
//            let interimText = "";

//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const result  = event.results[i]; 
//                 const transcript = result[0].transcript;
                
//                 if(result.isFinal) {
//                     finalText += transcript ;
//                 } else {
//                     interimText += transcript;
//                 }
//             }
          
//             if(finalText) {
//                setTranscript(prev => (prev + " " + finalText).trim());

//             }
//             if(finalText || interimText) {
//             resetSilenceTimer();
//             }
//         };

//         recognition.onerror = (error) => {
//             console.error("Speech Recognition Error: ", error);
//         };
//         recognition.start() ;
//         recognitionRef.current = recognition;
       
//     };

//     const resetSilenceTimer = () => {
//     clearTimeout(silenceTimeRef.current);

//     silenceTimeRef.current = setTimeout(() => {
//       onSilenceRef.current(transcriptRef.current);
//     }, 3000);
//   };

//     const stopListening = () => {
//     recognitionRef.current?.stop();
//     clearTimeout(silenceTimeRef.current);
//   };

//   return {
//     stopListening,
//     resetSilenceTimer,
//     startListening,
//   };
// };
    



// Start Micropone
// Convert speech to text
// detct 3sec pause/ slience
// auomitically call a callback function execute
// SpeechRecognition

import { useEffect, useRef, useState } from "react";

export const useSpeechToText = (onSilence) => {
  const recognitionRef = useRef(""); // SpeechRecognition
  const silenceTimeRef = useRef("");
  const onSilenceRef = useRef(onSilence);
  const transcriptRef = useRef("");
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    onSilenceRef.current = onSilence;
  }, [onSilence]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => (prev + " " + finalText).trim());
      }

      if (finalText || interimText) {
        resetSilenceTimer();
      }
    };

    recognition.onerror = (error) => {
      console.error("SpeechRecognition error", error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimeRef.current);
    console.log("Timer reset — 3s countdown started");

    silenceTimeRef.current = setTimeout(() => {
      onSilenceRef.current(transcriptRef.current);
      console.log("Silence detected — calling onSilence with:", transcriptRef.current);
    }, 3000);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    clearTimeout(silenceTimeRef.current);
  };

  return {
    stopListening,
    resetSilenceTimer,
    startListening,
  };
};

