import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";
import appConfig from "../app.config";
import "./Hero.css";

function Hero() {
  const videoRef = useRef(null);
  // 자동재생 안전 유틸: 정책 위반 에러는 무시하고 muted/inline 보장
  const attemptAutoplay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.setAttribute('muted', '');
    el.playsInline = true;
    el.setAttribute('playsinline', '');
    el.autoplay = true;
    const p = el.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {});
    }
  };
  const pickVariant = useMemo(() => {
    const vw = Math.max(document.documentElement.clientWidth || 360, 360);
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const effective = vw * dpr;
    // 초기 화질을 한 단계 상향: 360p/480p 우선
    if (effective <= 420) return './video/variants/intro-360.mp4';
    if (effective <= 800) return './video/variants/intro-480.mp4';
    return './video/variants/intro-720.mp4';
  }, []);

  // 네트워크 상태에 따라 상향 전환(프로그레시브 업그레이드)
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const connection = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
    const downlink = connection?.downlink || 1.0; // Mbps
    const upgrade = () => {
      // 이미 최고 해상도면 종료
      if (el.currentSrc.includes('intro-720')) return;
      // 네트워크 여유가 있으면 480 또는 720으로 업그레이드 (임계값 완화)
      if (downlink >= 3) {
        const base = './video/variants/intro-720';
        const webm = el.querySelector('source[type="video/webm"]');
        const mp4 = el.querySelector('source[type="video/mp4"]');
        if (webm) webm.src = `${base}.webm`;
        if (mp4) mp4.src = `${base}.mp4`;
        el.load();
        attemptAutoplay();
      } else if (downlink >= 1.5 && !el.currentSrc.includes('intro-480')) {
        const base = './video/variants/intro-480';
        const webm = el.querySelector('source[type="video/webm"]');
        const mp4 = el.querySelector('source[type="video/mp4"]');
        if (webm) webm.src = `${base}.webm`;
        if (mp4) mp4.src = `${base}.mp4`;
        el.load();
        attemptAutoplay();
      }
    };
    // 초기 재생 후 약간의 여유를 두고 업그레이드 시도
    const t = setTimeout(upgrade, 600);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    // 비디오를 가장 먼저 받도록 preload hint 추가
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = pickVariant;
    link.type = "video/mp4";
    document.head.appendChild(link);
    // 페이지 진입 즉시 재생 시도 (정책상 muted/inline 필요 - 이미 설정됨)
    const tryPlay = () => attemptAutoplay();
    // 약간 지연 후 한 번 더 시도 (소스 연결 직후)
    setTimeout(tryPlay, 0);
    // 사용자 제스처 fallback: 첫 상호작용 시 재생 재시도
    const onUserGesture = () => {
      tryPlay();
      window.removeEventListener('pointerdown', onUserGesture);
      window.removeEventListener('keydown', onUserGesture);
      window.removeEventListener('touchstart', onUserGesture);
    };
    window.addEventListener('pointerdown', onUserGesture, { once: true });
    window.addEventListener('keydown', onUserGesture, { once: true });
    window.addEventListener('touchstart', onUserGesture, { once: true });
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
      window.removeEventListener('pointerdown', onUserGesture);
      window.removeEventListener('keydown', onUserGesture);
      window.removeEventListener('touchstart', onUserGesture);
    };
  }, [pickVariant]);

  return (
    <Box className="hero-main">
      <Box className="section hero">
        {/* Top title overlay - shown above video on all devices */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            pt: { xs: 3, md: 6 },
            pb: { xs: 1, md: 3 },
            textAlign: "center",
            color: "#1a1a1a",
          }}
        >
          <Typography
            className="wedding-caps"
            variant="cormorant-sc-medium"
            sx={{ fontSize: { xs: "10px", sm: "12px" } }}
          >
            WEDDING INVITATION
          </Typography>
          <Box className="wedding-caps-name-box">
            <Typography className="wedding-caps-name" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
              {appConfig.couple.groom.name}
            </Typography>
            <Typography className="wedding-caps-name" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
              |
            </Typography>
            <Typography className="wedding-caps-name" sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
              {appConfig.couple.bride.name}
            </Typography>
          </Box>
        </Box>
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          ref={videoRef}
          onCanPlay={() => {
            attemptAutoplay();
          }}
          aria-label="intro background video"
          className="hero__video"
        >
          {/* WebM 우선, MP4 폴백 */}
          <source src={pickVariant.replace('.mp4', '.webm')} type="video/webm" />
          <source src={pickVariant} type="video/mp4" />
        </Box>

        <Box className="hero__wash" />
        {/* top and bottom fade like reference */}
        <Box className="hero__fade-top" />
        <Box className="hero__fade-bottom" />
      </Box>
      <Box
        sx={{
          marginTop: "100px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography
          className="script-names"
          variant="windsong"
          sx={{ fontSize: { xs: 22, sm: 26 } }}
        >
          {appConfig.site.mainCharacterEn}
        </Typography>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color="text.secondary">
          {new Date(appConfig.site.dateTime).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "long",
            hour: "numeric",
            minute: "2-digit",
          })}
        </Typography>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color="text.secondary">
          {appConfig.site.venue}
        </Typography>
      </Box>
    </Box>
  );
}

export default Hero;
