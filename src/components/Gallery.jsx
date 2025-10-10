import { Box } from "@mui/material";
import "./Gallery.css";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import appConfig from "../app.config";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PinchZoomSlide from "./PinchZoomSlide";

function Gallery() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartLeftRef = useRef(0);
  const preloadedSetRef = useRef(new Set());
  const preloadImage = useCallback((src) => {
    if (!src) return Promise.resolve();
    if (preloadedSetRef.current.has(src)) return Promise.resolve();
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        preloadedSetRef.current.add(src);
        resolve();
      };
      img.decoding = "async";
      img.loading = "eager";
      img.src = src;
    });
  }, []);

  // 이미지는 {thumb, full} 형태를 지원. 문자열이면 thumb를 '/thumb/'에 동일 파일명으로 맵핑, full은 원본 사용
  const toPair = (img) => {
    if (typeof img === "string") {
      const url = img;
      const thumb = (url.includes("/image/") || url.includes("./image/"))
        ? url.replace("/image/", "/thumb/").replace("./image/", "./thumb/")
        : url;
      return { thumb, full: url };
    }
    return img;
  };
  const images = (appConfig.gallery.images || []).map(toPair);
  const responsive = appConfig?.gallery?.responsive || {};
  const widths = responsive.widths || [600, 900, 1440, 2048];
  const sizesAttr = "(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 100vw";

  // 실제 리사이즈 파일 경로 구성: public/images/<w>/<original-path>
  const buildResizedPath = (fullPath, w) => {
    if (!fullPath) return undefined;
    // fullPath는 './image/1178.jpg' 형태. './image/' → './images/<w>/'로 치환
    if (fullPath.startsWith('./image/')) {
      return fullPath.replace('./image/', `./images/${w}/`);
    }
    // '/invitation/image/1178.jpg' 같은 경우도 처리
    if (fullPath.includes('/image/')) {
      return fullPath.replace('/image/', `/images/${w}/`);
    }
    return fullPath;
  };

  const buildSrcSet = useCallback((pair) => {
    if (!pair) return undefined;
    const candidates = [];
    if (widths.includes(600)) candidates.push(`${buildResizedPath(pair.full, 600)} 600w`);
    if (widths.includes(900)) candidates.push(`${buildResizedPath(pair.full, 900)} 900w`);
    if (widths.includes(1440)) candidates.push(`${buildResizedPath(pair.full, 1440)} 1440w`);
    if (widths.includes(2048)) candidates.push(`${buildResizedPath(pair.full, 2048)} 2048w`);
    return candidates.join(', ');
  }, [widths]);
  // horizontal scroller

  const openViewer = useCallback((index) => {
    setCurrent(index);
    setViewerOpen(true);
  }, []);

  // 라이트박스 열림/닫힘 상태를 전역으로 알림 → 오디오 토글 표시/숨김 제어
  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('lightbox-open', { detail: viewerOpen }));
    } catch {}
  }, [viewerOpen]);

  // 현재 기준 근접 이미지(±2장) 선로딩으로 전환 지연 최소화
  useEffect(() => {
    if (!images.length) return;
    const radius = 2;
    for (let d = 1; d <= radius; d++) {
      const nextIdx = (current + d) % images.length;
      const prevIdx = (current - d + images.length) % images.length;
      preloadImage(images[nextIdx]?.full);
      preloadImage(images[prevIdx]?.full);
    }
  }, [current, images, preloadImage]);

  // 초기 진입 시 상위 몇 장을 preload
  useEffect(() => {
    if (!images.length) return;
    const upfront = Math.min(3, images.length);
    for (let i = 0; i < upfront; i++) {
      const href = images[i]?.full;
      preloadImage(href);
    }
  }, [images, preloadImage]);

  // 전체 이미지 백그라운드 프리로딩 (동시 3개)
  useEffect(() => {
    if (!images.length) return;
    let cancelled = false;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const vw = Math.max(document.documentElement.clientWidth || 360, 360);
    const targetWidth = Math.min(1440, Math.ceil((vw * dpr) / 60) * 60);
    const pickWidth = widths.reduce((acc, w) => (w >= targetWidth ? Math.min(acc, w) : acc), 1440);
    const srcList = images.map((i) => buildResizedPath(i.full, pickWidth) || i.full).filter(Boolean);
    let cursor = 0;

    const run = async () => {
      while (!cancelled && cursor < srcList.length) {
        const index = cursor++;
        const src = srcList[index];
        if (preloadedSetRef.current.has(src)) continue;
        // eslint-disable-next-line no-await-in-loop
        await preloadImage(src);
      }
    };

    const runners = Array.from({ length: Math.min(3, srcList.length) }, run);
    Promise.allSettled(runners);
    return () => {
      cancelled = true;
    };
  }, [images, preloadImage]);

  // Lightbox 슬라이드 구성 (responsive srcset 포함)
  const slides = useMemo(() => {
    return images.map((pair, idx) => {
      const src = buildResizedPath(pair.full, 1440) || pair.full;
      const srcSet = [];
      if (widths.includes(600)) srcSet.push({ src: buildResizedPath(pair.full, 600) || pair.full, width: 600 });
      if (widths.includes(900)) srcSet.push({ src: buildResizedPath(pair.full, 900) || pair.full, width: 900 });
      if (widths.includes(1440)) srcSet.push({ src: buildResizedPath(pair.full, 1440) || pair.full, width: 1440 });
      if (widths.includes(2048)) srcSet.push({ src: buildResizedPath(pair.full, 2048) || pair.full, width: 2048 });
      return { src, srcSet, sizes: sizesAttr, alt: `gallery-${idx + 1}` };
    });
  }, [images, widths]);

  // Lightbox가 자체적으로 키보드(좌/우/ESC) 네비게이션을 처리하므로 별도 핸들러 불필요

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
              srcSet={`${buildResizedPath(item.full, 600)} 600w, ${buildResizedPath(item.full, 900)} 900w`}
              sizes={sizesAttr}
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
      <Lightbox
        open={viewerOpen}
        close={() => setViewerOpen(false)}
        index={current}
        slides={slides}
        carousel={{ finite: true, preload: 3 }}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 300 }}
        render={{
          slide: ({ slide, rect, index }) => (
            <PinchZoomSlide src={slide.src} alt={slide.alt} onClick={() => {}} />
          ),
        }}
        on={{
          click: () => {},
          pointerDown: (e) => {
            // 라이트박스 레이어가 우선 처리하지 않도록 오디오 토글 버튼 영역 클릭 시 무시
            const target = e.target;
            if (target.closest && target.closest('[data-audio-toggle]')) {
              e.stopPropagation();
            }
          },
        }}
      />
    </Box>
  );
}

export default Gallery;
