"use client";
import { useEffect, useRef } from "react";

const GlowCard = ({ children, identifier }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return; // Hindari SSR error

    const CONTAINER = containerRef.current;
    const CARDS = cardRefs.current;

    if (!CONTAINER || CARDS.length === 0) return;

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    const UPDATE = (event) => {
      CARDS.forEach((CARD) => {
        const CARD_BOUNDS = CARD.getBoundingClientRect();
        const isInside =
          event?.x > CARD_BOUNDS.left - CONFIG.proximity &&
          event?.x < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
          event?.y > CARD_BOUNDS.top - CONFIG.proximity &&
          event?.y < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity;

        CARD.style.setProperty("--active", isInside ? 1 : CONFIG.opacity);

        const CARD_CENTER = [
          CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
          CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5,
        ];

        let ANGLE =
          (Math.atan2(event?.y - CARD_CENTER[1], event?.x - CARD_CENTER[0]) *
            180) /
          Math.PI;
        ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;

        CARD.style.setProperty("--start", ANGLE + 90);
      });
    };

    window.addEventListener("pointermove", UPDATE);

    const RESTYLE = () => {
      CONTAINER.style.setProperty("--gap", CONFIG.gap);
      CONTAINER.style.setProperty("--blur", CONFIG.blur);
      CONTAINER.style.setProperty("--spread", CONFIG.spread);
      CONTAINER.style.setProperty(
        "--direction",
        CONFIG.vertical ? "column" : "row"
      );
    };

    RESTYLE();
    UPDATE();

    return () => {
      window.removeEventListener("pointermove", UPDATE);
    };
  }, []);

  return (
    <div ref={containerRef} className={`glow-container-${identifier} glow-container`}>
      <article
        ref={(el) => el && cardRefs.current.push(el)}
        className={`glow-card glow-card-${identifier} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full`}
      >
        <div className="glows"></div>
        {children}
      </article>
    </div>
  );
};

export default GlowCard;
