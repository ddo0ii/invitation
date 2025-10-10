import { useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Fab, Portal } from "@mui/material";

function AudioToggle({ src = "./audio/TrackTribe.mp3" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hiddenByLightbox, setHiddenByLightbox] = useState(false);

  // 오디오 초기화 + 첫 사용자 제스처에서 재생(음소거 해제)
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.loop = true;
    audioEl.preload = "auto";
    audioEl.volume = 0.6;
    audioEl.muted = true; // 진입 시 꺼진 상태

    let unlocked = false;
    const unlock = async () => {
      if (unlocked) return;
      try {
        audioEl.muted = false;
        await audioEl.play();
        setIsMuted(false);
        setIsPlaying(true);
        unlocked = true;
      } catch {}
      // 한번만 시도하고 리스너 제거
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("touchstart", unlock, true);
      document.removeEventListener("mousedown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
    };

    // 캡처 단계에서 가장 먼저 가로채 재생 시도 (오버레이가 막아도 동작)
    document.addEventListener("pointerdown", unlock, { capture: true });
    document.addEventListener("touchstart", unlock, { capture: true });
    document.addEventListener("mousedown", unlock, { capture: true });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") unlock();
    }, { capture: true });

    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("touchstart", unlock, true);
      document.removeEventListener("mousedown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      audioEl.pause();
    };
  }, [src]);

  // 불필요한 외부 이벤트 연동 제거

  const toggle = async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (!isPlaying) {
      try {
        await audioEl.play();
        setIsPlaying(true);
      } catch {}
    }
    const nextMuted = !isMuted;
    audioEl.muted = nextMuted;
    setIsMuted(nextMuted);
  };
  // 외부 이벤트/라이트박스 연동 제거 (단순 동작만 유지)
  useEffect(() => {
    const onLightbox = (e) => setHiddenByLightbox(Boolean(e.detail));
    window.addEventListener("lightbox-open", onLightbox);
    return () => window.removeEventListener("lightbox-open", onLightbox);
  }, []);

  return (
    <>
      <audio ref={audioRef} src={src} playsInline autoPlay muted={isMuted} />
      <Portal container={document.body}>
        <Fab
          data-audio-toggle
          color="default"
          aria-label={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggle(); }}
          onPointerDown={(e) => { e.stopPropagation(); }}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 2147483647,
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            WebkitTapHighlightColor: "transparent",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            width: 56,
            height: 56,
            minWidth: 56,
            minHeight: 56,
            lineHeight: 1,
            p: 0,
            borderRadius: "50%",
            overflow: "hidden",
            '& svg': {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 24,
            },
            opacity: hiddenByLightbox ? 0 : 1,
            pointerEvents: hiddenByLightbox ? 'none' : 'auto',
            transition: 'opacity 160ms ease',
          }}
        >
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </Fab>
      </Portal>
    </>
  );
}

export default AudioToggle;
