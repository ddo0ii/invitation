import { useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Fab, Portal } from "@mui/material";

function AudioToggle({ src = "./audio/TrackTribe.mp3" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // 자동재생 시도 + 실패 시 전역 클릭/터치에서 재시도
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.loop = true;
    audioEl.preload = "auto";
    audioEl.volume = 0.6;
    audioEl.muted = true;

    const tryPlay = async () => {
      try {
        await audioEl.play();
        setIsPlaying(true);
        removeUnlockListeners();
      } catch (e) {
        console.error(e);
        // 자동재생 실패 → 사용자 상호작용 대기
        addUnlockListeners();
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible" && !isPlaying) {
        tryPlay();
      }
    };

    const unlock = async () => {
      try {
        await audioEl.play();
        setIsPlaying(true);
        removeUnlockListeners();
      } catch (e) {
        console.error(e);
      }
    };

    const addUnlockListeners = () => {
      document.addEventListener("click", unlock, { once: true });
      document.addEventListener("touchstart", unlock, { once: true });
    };
    const removeUnlockListeners = () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
    };

    // 초기 자동재생 시도
    tryPlay();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      removeUnlockListeners();
      document.removeEventListener("visibilitychange", onVisibility);
      audioEl.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const toggle = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    // 재생 상태는 유지하고 음소거만 토글
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
