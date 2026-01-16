"use client"
import { useCallback, useEffect, useState } from 'react';

export const useSovereignVoice = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const initVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };
    initVoices();
    window.speechSynthesis.onvoiceschanged = initVoices;
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // 🛡️ RE-PRIME: Cancel everything before starting new transmission
    window.speechSynthesis.cancel(); 
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select the most authoritative English voice available
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US') || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    
    // SOVEREIGN TONE CONSTANTS
    utterance.pitch = 0.65; 
    utterance.rate = 0.85;   
    utterance.volume = 1.0; 

    window.speechSynthesis.speak(utterance);
    console.log("🔊 TRANSMITTING_AUDIO: " + text);
  }, [voices]);

  return { speak };
};