import { useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Fab, Portal } from "@mui/material";

function AudioToggle({ src = "./audio/TrackTribe.mp3" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // 오디오 설정 + 사용자 상호작용 대기
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.loop = true;
    audioEl.preload = "auto";
    audioEl.volume = 0.6;
    audioEl.muted = true;

    const unlock = async () => {
      try {
        audioEl.muted = false;
        await audioEl.play();
        setIsPlaying(true);
        setIsMuted(false);
        removeUnlockListeners();
      } catch (e) {
        console.error(e);
      }
    };

    const addUnlockListeners = () => {
      document.addEventListener("click", unlock, { once: true });
      document.addEventListener("touchstart", unlock, { once: true });
      document.addEventListener("pointerdown", unlock, { once: true });
    };
    const removeUnlockListeners = () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("pointerdown", unlock);
    };

    // 사용자 상호작용 대기
    addUnlockListeners();

    return () => {
      removeUnlockListeners();
      audioEl.pause();
    };
  }, [src]);

  // 입장 오버레이가 보내는 이벤트로 즉시 소리 켜기
  useEffect(() => {
    const handler = async () => {
      const audioEl = audioRef.current;
      if (!audioEl) return;
      try {
        audioEl.muted = false;
        await audioEl.play();
        setIsMuted(false);
        setIsPlaying(true);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("enable-audio", handler, { once: true });
    return () => window.removeEventListener("enable-audio", handler);
  }, []);

  const toggle = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    // 재생 상태가 아니면 우선 재생 시도
    if (!isPlaying) {
      try {
        await audioEl.play();
        setIsPlaying(true);
      } catch (e) {
        console.error(e);
      }
    }
    const nextMuted = !isMuted;
    audioEl.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <>
      <audio ref={audioRef} src={src} playsInline autoPlay muted />
      <Portal container={document.body}>
        <Fab
          color="default"
          aria-label={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
          onClick={toggle}
          sx={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 20000,
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            pointerEvents: "auto",
          }}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </Fab>
      </Portal>
    </>
  );
}

export default AudioToggle;
