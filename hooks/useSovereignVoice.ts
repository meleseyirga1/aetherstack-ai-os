"use client"
import { useCallback, useEffect, useState } from 'react';

export const useSovereignVoice = () => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Look for the most authoritative natural voice
      const preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('Natural')) || voices[0];
      setVoice(preferred);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((text: string, pitch: number = 0.65) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Clear queue
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    
    utterance.pitch = pitch;
    utterance.rate = 0.9;
    utterance.volume = 0.6; // Increased volume

    window.speechSynthesis.speak(utterance);
    console.log("🔊 SOVEREIGN_VOICE: " + text);
  }, [voice]);

  return { speak };
};