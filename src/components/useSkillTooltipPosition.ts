import { RefObject, useLayoutEffect, useRef, useState } from 'react';

export type SkillTooltipAnchor = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  scale: number;
  centered: boolean;
};

export type SkillTooltipLayout = {
  left: number;
  top: number;
};

const TOOLTIP_BASE_WIDTH = 380;

// Touch devices use centered modal-style tooltips instead of hover placement.
export const shouldCenterTooltip = () =>
  window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 1024;

export function useSkillTooltipPosition(nodeRef: RefObject<HTMLDivElement | null>) {
  const [tooltipPos, setTooltipPos] = useState<SkillTooltipAnchor | null>(null);
  const [tooltipLayout, setTooltipLayout] = useState<SkillTooltipLayout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Capture node bounds before the tooltip is portaled to document.body.
  const showTooltip = () => {
    if (!nodeRef.current) return;

    const rect = nodeRef.current.getBoundingClientRect();
    const nodeScale = rect.width / 64;
    const centeredTooltip = shouldCenterTooltip();
    const maxViewportScale = (window.innerWidth * 0.9) / TOOLTIP_BASE_WIDTH;

    setTooltipLayout(null);
    setTooltipPos({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      scale: centeredTooltip ? Math.min(nodeScale, maxViewportScale) : nodeScale,
      centered: centeredTooltip,
    });
  };

  const closeTooltip = () => {
    setTooltipPos(null);
    setTooltipLayout(null);
  };

  // Measure the rendered tooltip, then clamp it into the viewport.
  useLayoutEffect(() => {
    if (!tooltipPos || !tooltipRef.current) return;

    const margin = 8 * tooltipPos.scale;
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    if (tooltipPos.centered) {
      setTooltipLayout({
        left: Math.max(margin, (window.innerWidth - tooltipRect.width) / 2),
        top: Math.max(margin, (window.innerHeight - tooltipRect.height) / 2),
      });
      return;
    }

    const clampedLeft = Math.min(
      Math.max(tooltipPos.left, margin),
      window.innerWidth - tooltipRect.width - margin
    );
    let top = tooltipPos.top - tooltipRect.height - margin;

    if (top < margin) {
      top = tooltipPos.bottom + margin;
    }

    if (top + tooltipRect.height > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - tooltipRect.height - margin);
    }

    setTooltipLayout({ left: clampedLeft, top });
  }, [tooltipPos]);

  return {
    tooltipRef,
    tooltipPos,
    tooltipLayout,
    showTooltip,
    closeTooltip,
  };
}
