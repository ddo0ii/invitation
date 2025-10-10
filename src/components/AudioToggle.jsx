import { useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Fab, Portal } from "@mui/material";

function AudioToggle({ src = "./audio/TrackTribe.mp3" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hiddenByLightbox, setHiddenByLightbox] = useState(false);

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
        // 최초 사용자 제스처 시 재생만 시도(음소거 상태는 유지)
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
    try {
      window.dispatchEvent(new CustomEvent("audio-state", { detail: { isMuted: nextMuted } }));
    } catch {}
  };

  // 외부에서 토글 요청을 받을 수 있도록 이벤트 리스너 추가
  useEffect(() => {
    const onToggle = () => toggle();
    const onGetState = () => {
      try {
        window.dispatchEvent(new CustomEvent("audio-state", { detail: { isMuted } }));
      } catch {}
    };
    window.addEventListener("audio-toggle", onToggle);
    window.addEventListener("audio-get-state", onGetState);
    const onLightbox = (e) => setHiddenByLightbox(Boolean(e.detail));
    window.addEventListener("lightbox-open", onLightbox);
    // 초기 상태 브로드캐스트
    try {
      window.dispatchEvent(new CustomEvent("audio-state", { detail: { isMuted } }));
    } catch {}
    return () => {
      window.removeEventListener("audio-toggle", onToggle);
      window.removeEventListener("audio-get-state", onGetState);
      window.removeEventListener("lightbox-open", onLightbox);
    };
  }, [isMuted]);

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
            // position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 2147483647,
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            // 갤러리 라이트박스 때만 숨김 (이 값은 이벤트로 제어)
            pointerEvents: "auto",
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
