"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./BrandCarousel.module.css";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function BrandCarousel({ brands = [] }) {
  const scrollerRef = useRef(null);
  const focusTimeoutRef = useRef();
  const [activeId, setActiveId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const interactiveBrands = brands;
  const loopedBrands = useMemo(
    () => [...interactiveBrands, ...interactiveBrands],
    [interactiveBrands]
  );

  const itemRefs = useRef([]);
  itemRefs.current = [];

  useEffect(() => {
    if (interactiveBrands.length === 0) return;
    if (prefersReducedMotion) return;
    const container = scrollerRef.current;
    if (!container) return;

    let frameId;
    let lastTimestamp;
    const scrollableWidth = container.scrollWidth / 2;
    const baseSpeed = 0.12; // pixels per millisecond

    const step = (timestamp) => {
      if (lastTimestamp === undefined) {
        lastTimestamp = timestamp;
        frameId = requestAnimationFrame(step);
        return;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isPaused) {
        container.scrollLeft += delta * baseSpeed;
        if (container.scrollLeft >= scrollableWidth) {
          container.scrollLeft -= scrollableWidth;
        }
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [interactiveBrands.length, isPaused, prefersReducedMotion]);

  useEffect(() => {
    const container = scrollerRef.current;
    if (!container) return;

    const handlePointerEnter = () => setIsPaused(true);
    const handlePointerLeave = () => {
      if (!activeId) {
        setIsPaused(false);
      }
    };

    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [activeId]);

  const scrollByOffset = (direction) => {
    const container = scrollerRef.current;
    if (!container) return;
    const offset = container.clientWidth * 0.6 * direction;
    setIsPaused(true);
    container.scrollBy({ left: offset, behavior: "smooth" });
    window.setTimeout(() => {
      if (!activeId) {
        setIsPaused(false);
      }
    }, 900);
  };

  const registerItemRef = (el) => {
    if (el) {
      itemRefs.current.push(el);
    }
  };

  const focusBrandAt = (index) => {
    const clamped = (index + interactiveBrands.length) % interactiveBrands.length;
    const element = itemRefs.current[clamped];
    element?.focus();
  };

  const handleLogoKeyDown = (event, index) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBrandAt(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBrandAt(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusBrandAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusBrandAt(interactiveBrands.length - 1);
    }
  };

  const handleActivateBrand = (brandId) => {
    setActiveId((current) => {
      const next = current === brandId ? null : brandId;
      setIsPaused(Boolean(next));
      return next;
    });
  };

  const handleFocus = (brandId) => {
    clearTimeout(focusTimeoutRef.current);
    setActiveId(brandId);
    setIsPaused(true);
  };

  const handleBlur = () => {
    clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = window.setTimeout(() => {
      setActiveId((current) => {
        if (current) {
          setIsPaused(false);
        }
        return null;
      });
    }, 120);
  };

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label="Brand showcase carousel"
    >
      <div className={styles.carousel__header}>
        <h2 className={styles.carousel__title}>Partner brands &amp; collaborators</h2>
        <div className={styles.carousel__controls}>
          <button
            type="button"
            onClick={() => scrollByOffset(-1)}
            className={styles.carousel__button}
            aria-label="Scroll brands backward"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByOffset(1)}
            className={styles.carousel__button}
            aria-label="Scroll brands forward"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div
        className={styles.carousel__viewport}
        role="group"
        aria-live="polite"
        ref={scrollerRef}
      >
        <div className={styles.carousel__track}>
          {loopedBrands.map((brand, index) => {
            const isDuplicate = index >= interactiveBrands.length;
            const isActive = activeId === brand.id;
            const interactive = !isDuplicate;

            return (
              <div
                key={`${brand.id}-${index}`}
                className={styles.carousel__item}
                data-active={isActive}
                data-interactive={interactive}
                aria-hidden={isDuplicate ? "true" : undefined}
              >
                <button
                  type="button"
                  className={styles.carousel__logoButton}
                  onClick={() => interactive && handleActivateBrand(brand.id)}
                  onFocus={() => interactive && handleFocus(brand.id)}
                  onBlur={() => interactive && handleBlur()}
                  onKeyDown={(event) =>
                    interactive && handleLogoKeyDown(event, index)
                  }
                  ref={interactive ? registerItemRef : undefined}
                  tabIndex={interactive ? 0 : -1}
                  aria-label={`${brand.name} logo`}
                  aria-expanded={interactive ? isActive : undefined}
                  aria-controls={interactive ? `${brand.id}-description` : undefined}
                >
                  <span className={styles["sr-only"]}>{brand.name}</span>
                  <div className={styles.carousel__logoWrapper}>
                    <Image
                      src={brand.logo}
                      alt=""
                      width={240}
                      height={160}
                      className={styles.carousel__logoImage}
                      loading={index < 4 ? "eager" : "lazy"}
                      draggable={false}
                    />
                  </div>
                </button>
                <p
                  id={`${brand.id}-description`}
                  className={styles.carousel__description}
                  role="status"
                  aria-live={isActive ? "polite" : "off"}
                >
                  {brand.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
