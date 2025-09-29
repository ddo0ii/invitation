import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import "./Gallery.css";
import { useCallback, useEffect, useRef, useState } from "react";
import appConfig from "../app.config";

function Gallery() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);
  const imgRef = useRef(null);
  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);

  // 뷰어 스와이프 제어 (한 번의 드래그에 한 번만 이동)
  const viewerSwipe = useRef({ startX: 0, hasSwiped: false });

  // 이미지는 {thumb, full} 형태를 지원. 문자열이면 thumb를 '/thumb/'에 동일 파일명으로 맵핑, full은 원본 사용
  const toPair = (img) => {
    if (typeof img === "string") {
      const url = img;
      const thumb = url.replace("/image/", "/thumb/");
      return { thumb, full: url };
    }
    return img;
  };
  const images = (appConfig.gallery.images || []).map(toPair);
  // horizontal scroller

  const openViewer = useCallback((index) => {
    setCurrent(index);
    setViewerOpen(true);
  }, []);

  const handlePrev = useCallback(() => {
    if (!images.length) return;
    setCurrent((v) => (v - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    if (!images.length) return;
    setCurrent((v) => (v + 1) % images.length);
  }, [images.length]);

  const toggleFullscreen = useCallback(async () => {
    const el = fullscreenRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 다음/이전 이미지 미리 로드하여 전환 시 깜빡임 방지
  useEffect(() => {
    if (!images.length) return;
    const nextImg = new Image();
    const prevImg = new Image();
    nextImg.src = images[(current + 1) % images.length]?.full;
    prevImg.src = images[(current - 1 + images.length) % images.length]?.full;
  }, [current, images]);

  useEffect(() => {
    const onKey = (e) => {
      if (!viewerOpen) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setViewerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerOpen, handlePrev, handleNext]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (!e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      scrollStartLeftRef.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      el.scrollLeft = scrollStartLeftRef.current - dx;
    };
    const stopDrag = () => {
      isDraggingRef.current = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, []);

  return (
    <Box className="gallery">
      <Box ref={scrollRef} className="gallery__track">
        {images.map((item, idx) => (
          <Box key={(item.full || item.thumb) + idx} className="gallery__item">
            <Box
              component="img"
              src={item.thumb}
              alt="gallery"
              loading="lazy"
              decoding="async"
              onClick={() => openViewer(idx)}
              onError={(e) => {
                // 썸네일이 없으면 원본으로 대체
                e.currentTarget.src = item.full;
              }}
              className="gallery__img"
            />
          </Box>
        ))}
      </Box>

      <Dialog open={viewerOpen} onClose={() => setViewerOpen(false)} fullScreen>
        <Box
          ref={fullscreenRef}
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            overflow: "hidden",
          }}
        >
          {/* 드래그/클릭 네비게이션 */}
          <Box
            className="viewer__hit"
            onPointerDown={(e) => {
              viewerSwipe.current.startX = e.clientX;
              viewerSwipe.current.hasSwiped = false;
            }}
            onPointerMove={(e) => {
              if (e.buttons !== 1) return; // only while pressing
              if (viewerSwipe.current.hasSwiped) return;
              const dx = e.clientX - viewerSwipe.current.startX;
              if (Math.abs(dx) > 60) {
                if (dx > 0) handlePrev();
                else handleNext();
                viewerSwipe.current.hasSwiped = true;
              }
            }}
            onPointerUp={(e) => {
              const dx = e.clientX - viewerSwipe.current.startX;
              if (!viewerSwipe.current.hasSwiped && Math.abs(dx) < 30) {
                // 탭처럼 클릭 영역으로 이동
                const w = e.currentTarget.clientWidth;
                if (e.clientX < w * 0.33) handlePrev();
                else if (e.clientX > w * 0.67) handleNext();
              }
            }}
          />
          <IconButton
            aria-label="fullscreen"
            onClick={toggleFullscreen}
            className="viewer__btn viewer__btn--fs"
            sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 3 }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton
            aria-label="close"
            onClick={() => setViewerOpen(false)}
            className="viewer__btn viewer__btn--close"
            sx={{ position: "absolute", top: 16, right: 16, zIndex: 3 }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                key={images[current]?.full}
                ref={imgRef}
                component="img"
                src={images[current]?.full}
                alt={`gallery-${current + 1}`}
                className="viewer__img"
                fetchpriority="high"
                style={{ pointerEvents: "auto" }}
              />
              <Typography
                className="viewer__count"
                style={{ pointerEvents: "auto" }}
              >
                {current + 1} / {images.length}
              </Typography>
            </Box>
          </Box>

          {/* 화살표 버튼 - 컨테이너 기준 절대배치 */}
          <IconButton
            aria-label="prev"
            onClick={handlePrev}
            className="viewer__btn viewer__btn--prev"
            sx={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              zIndex: 3,
            }}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="next"
            onClick={handleNext}
            className="viewer__btn viewer__btn--next"
            sx={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              zIndex: 3,
            }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Gallery;
