import { useCurrentFrame, interpolate, staticFile, Img } from "remotion";

const LOGO_WIDTH = 320;

const RAINBOW =
  "linear-gradient(90deg, #ff0000 0%, #ff7700 17%, #ffff00 33%, #00cc00 50%, #0044ff 67%, #8800cc 83%, #ff0066 100%)";

export const MyComposition = () => {
  const frame = useCurrentFrame();

  // Logo fades in during first 12 frames
  const logoOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rainbow sweep: gradient moves from -100% to +100% translateX
  const sweepX = interpolate(frame, [10, 65], [-110, 110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rainbow layer fades in then out
  const rainbowOpacity = interpolate(
    frame,
    [10, 18, 58, 68],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const svgUrl = staticFile("CritiCore_Logonor.svg");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
      }}
    >
      {/* Logo container — top left */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          width: LOGO_WIDTH,
          opacity: logoOpacity,
        }}
      >
        {/* Original SVG — colors never changed */}
        <Img
          src={svgUrl}
          style={{ width: LOGO_WIDTH, display: "block" }}
        />

        {/* Rainbow layer masked to the logo's visible pixels */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: rainbowOpacity,
            WebkitMaskImage: `url(${svgUrl})`,
            maskImage: `url(${svgUrl})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            overflow: "hidden",
          }}
        >
          {/* Moving rainbow strip — wider than container for smooth entry/exit */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "-50%",
              width: "200%",
              background: RAINBOW,
              transform: `translateX(${sweepX}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
