import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box, Dialog, IconButton, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import appConfig from "../app.config";

function Gallery() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);
  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);

  const images = appConfig.gallery.images;
  // horizontal scroller

  const openViewer = useCallback((index) => {
    setCurrent(index);
    setViewerOpen(true);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrent((v) => (v - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
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
    <Box sx={{ position: "relative" }}>
      <Box
        ref={scrollRef}
        sx={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "130px",
          gridTemplateRows: "repeat(4, 130px)",
          gap: 1,
          overflowX: "auto",
          overflowY: "hidden",
          px: 1,
          cursor: "grab",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          WebkitOverflowScrolling: "touch",
        }}
      >
        {images.map((src, idx) => (
          <Box key={src + idx} sx={{ width: "100%", height: "100%" }}>
            <Box
              component="img"
              src={src}
              alt="gallery"
              onClick={() => openViewer(idx)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                userSelect: "none",
              }}
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
            bgcolor: "black",
          }}
        >
          {/* 드래그/클릭 네비게이션 */}
          <Box
            sx={{ position: "absolute", inset: 0, zIndex: 1 }}
            onPointerDown={(e) => {
              dragStartXRef.current = e.clientX;
            }}
            onPointerUp={(e) => {
              const dx = e.clientX - dragStartXRef.current;
              if (dx > 40) handlePrev();
              else if (dx < -40) handleNext();
              else {
                // 클릭 영역으로 이동
                const w = e.currentTarget.clientWidth;
                if (e.clientX < w * 0.33) handlePrev();
                else if (e.clientX > w * 0.67) handleNext();
              }
            }}
          />
          <IconButton
            aria-label="close"
            onClick={() => setViewerOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 2,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            aria-label="prev"
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              zIndex: 2,
              color: "white",
            }}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="next"
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              zIndex: 2,
              color: "white",
            }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="fullscreen"
            onClick={toggleFullscreen}
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              zIndex: 2,
              color: "white",
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>

          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", height: "100%" }}
          >
            <Box
              component="img"
              src={images[current]}
              alt={`gallery-${current + 1}`}
              sx={{
                maxWidth: "100vw",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
            <Typography color="white" sx={{ mt: 1 }}>
              {current + 1} / {images.length}
            </Typography>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Gallery;
