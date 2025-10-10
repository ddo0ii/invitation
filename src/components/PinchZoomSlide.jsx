import { useRef } from "react";
import { a, useSpring } from "@react-spring/web";
import { usePinch, useDrag } from "@use-gesture/react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function PinchZoomSlide({ src, alt, onClick }) {
  const containerRef = useRef(null);
  const [{ x, y, scale }, api] = useSpring(() => ({ x: 0, y: 0, scale: 1, config: { tension: 300, friction: 30 } }));

  // 드래그(팬) 제스처 - 확대된 상태에서만 이동 허용
  useDrag(({ down, offset: [ox, oy] }) => {
    api.start({ x: down ? ox : 0, y: down ? oy : 0 });
  }, {
    target: containerRef,
    from: () => [x.get(), y.get()],
    filterTaps: true,
    enabled: scale.get() > 1,
    bounds: () => {
      const el = containerRef.current;
      if (!el) return undefined;
      const rect = el.getBoundingClientRect();
      const maxX = (rect.width * (scale.get() - 1)) / 2;
      const maxY = (rect.height * (scale.get() - 1)) / 2;
      return { left: -maxX, right: maxX, top: -maxY, bottom: maxY };
    },
    rubberband: 0.15,
  });

  // 핀치 제스처 - 손을 떼면 원상 복귀
  usePinch(({ origin: [ox, oy], first, last, movement: [d], memo = scale.get() }) => {
    if (first) memo = scale.get();
    const next = clamp(memo * d, 1, 3);
    api.start({ scale: next });
    if (last) api.start({ to: { x: 0, y: 0, scale: 1 } });
    return memo;
  }, { target: containerRef, scaleBounds: { min: 1, max: 3 }, rubberband: true });

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        touchAction: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      onClick={onClick}
    >
      <a.img
        src={src}
        alt={alt}
        style={{
          willChange: "transform",
          transform: scale.to((s) => `translate3d(${x.get()}px, ${y.get()}px, 0) scale(${s})`),
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "auto",
        }}
        draggable={false}
      />
    </div>
  );
}

export default PinchZoomSlide;
