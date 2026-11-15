import { useEffect, useRef, useState } from "react";

const SILENCE_MS = 3000;

export const useSpeechToText = (onSilence) => {
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const onSilenceRef = useRef(onSilence);
  const finalTextRef = useRef(""); 
  const fullTextRef = useRef(""); 
  const activeRef = useRef(false); 
  const [transcript, setTranscript] = useState("");


  useEffect(() => {
    onSilenceRef.current = onSilence;
  }, [onSilence]);

  const clearTimer = () => {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
  };


  const teardown = () => {
    activeRef.current = false;
    clearTimer();
    const rec = recognitionRef.current;
    if (rec) {
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.abort();
      } catch (e) {
        /* already stopped */
      }
      recognitionRef.current = null;
    }
  };

  const armSilenceTimer = () => {
    clearTimer();
    silenceTimerRef.current = setTimeout(() => {
      const text = fullTextRef.current.trim();
      if (!activeRef.current || !text) return; 
      teardown(); 
      console.log("Silence detected — submitting:", text);
      onSilenceRef.current(text);
    }, SILENCE_MS);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported");
      return;
    }

    teardown(); 

    
    finalTextRef.current = "";
    fullTextRef.current = "";
    setTranscript("");
    activeRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      if (!activeRef.current) return;

      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTextRef.current = (
            finalTextRef.current +
            " " +
            result[0].transcript
          ).trim();
        } else {
          interim += result[0].transcript;
        }
      }

      const full = (finalTextRef.current + " " + interim).trim();
      fullTextRef.current = full; 
      setTranscript(full); 

      if (full) armSilenceTimer(); 
    };

    recognition.onerror = (event) => {
      console.error("SpeechRecognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        teardown(); // mic permission denied, don't loop
      }
      
    };

    
    recognition.onend = () => {
      if (!activeRef.current || recognitionRef.current !== recognition) return;
      setTimeout(() => {
        if (!activeRef.current || recognitionRef.current !== recognition) return;
        try {
          recognition.start();
        } catch (e) {
          console.warn("Could not restart recognition:", e);
        }
      }, 250);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    teardown();
  };

  
  useEffect(() => teardown, []);

  return {
    transcript,
    startListening,
    stopListening,
  };
};
