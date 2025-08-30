import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import appConfig from "../app.config";

function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const images = appConfig.gallery.images;
  const initialCount = 4; // 접힘 상태에서 2행(2열 기준)

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

  const recalcHeights = useCallback(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;
    const items = contentEl.querySelectorAll('[data-gallery-item="true"]');
    const totalHeight = contentEl.scrollHeight;
    setContentHeight(totalHeight);
    if (items.length >= initialCount) {
      const top = items[0].offsetTop || 0;
      const target = items[initialCount - 1];
      const bottom = (target.offsetTop || 0) + (target.offsetHeight || 0);
      setCollapsedHeight(bottom - top);
    } else {
      setCollapsedHeight(totalHeight);
    }
  }, [initialCount]);

  useEffect(() => {
    recalcHeights();
  }, [images, recalcHeights]);

  useEffect(() => {
    const onResize = () => recalcHeights();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcHeights]);

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={containerRef}
        sx={{
          overflow: "hidden",
          transition: "max-height 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          maxHeight: expanded ? `${contentHeight}px` : `${collapsedHeight}px`,
        }}
      >
        <Box
          ref={contentRef}
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}
        >
          {images.map((src, idx) => (
            <Box key={src + idx} data-gallery-item="true">
              <Box
                component="img"
                src={src}
                alt="gallery"
                onLoad={recalcHeights}
                onClick={() => openViewer(idx)}
                sx={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {!expanded && images.length > initialCount && (
        <Box sx={{ position: "relative", mt: 2 }}>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: -72,
              height: 72,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,1) 100%)",
              backdropFilter: "blur(2px)",
              pointerEvents: "none",
            }}
          />
          <Box textAlign="center">
            <Button variant="outlined" onClick={() => setExpanded(true)}>
              사진 더 보기
            </Button>
          </Box>
        </Box>
      )}

      {expanded && images.length > initialCount && (
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={() => setExpanded(false)}>
            사진 접기
          </Button>
        </Box>
      )}

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
