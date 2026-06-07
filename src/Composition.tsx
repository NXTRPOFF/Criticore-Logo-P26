import {
  useCurrentFrame,
  interpolate,
  staticFile,
  Img,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

const LOGO_WIDTH = 320;

// Full smooth rainbow spectrum across the whole logo.
const hslStops = Array.from({ length: 25 }, (_, i) => {
  const pct = (i / 24) * 100;
  const hue = (i / 24) * 360;
  return `hsl(${hue.toFixed(1)},100%,55%) ${pct.toFixed(2)}%`;
}).join(", ");
const RAINBOW = `linear-gradient(90deg, ${hslStops})`;

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing helper: seconds → frames (framerate-independent).
  const s = (sec: number) => sec * fps;

  // --- Entrance (spring): slide in from left + gentle scale up ---
  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
    durationInFrames: Math.round(0.95 * fps),
  });

  const logoX = interpolate(entrance, [0, 1], [-60, 0]);
  const logoScale = interpolate(entrance, [0, 1], [0.82, 1]);
  const logoOpacity = interpolate(entrance, [0, 0.35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // --- Rainbow: smooth fade in → hold → smooth fade out ---
  const rainbowOpacity = interpolate(
    frame,
    [s(0.73), s(1.5), s(2.07), s(2.87)],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Gentle hue drift so the rainbow feels alive while visible.
  const hueShift = interpolate(frame, [s(0.73), s(2.87)], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pngUrl = staticFile("CritiCore_Logonor.png");

  return (
    <div style={{ position: "absolute", inset: 0, background: "transparent" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          width: LOGO_WIDTH,
          opacity: logoOpacity,
          transform: `translateX(${logoX}px) scale(${logoScale})`,
          transformOrigin: "left center",
          // Soft shadow keeps the logo readable on bright/busy backgrounds.
          filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.28))",
        }}
      >
        {/* Original logo — always fully visible underneath, colors untouched */}
        <Img src={pngUrl} style={{ width: LOGO_WIDTH, display: "block" }} />

        {/* Rainbow overlay — masked to the logo shape, simply fades in and out */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: rainbowOpacity,
            WebkitMaskImage: `url(${pngUrl})`,
            maskImage: `url(${pngUrl})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: RAINBOW,
              filter: `hue-rotate(${hueShift}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
