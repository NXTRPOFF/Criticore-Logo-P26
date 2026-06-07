import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CritiCoreLogoPride"
        component={MyComposition}
        durationInFrames={180}
        fps={60}
        width={1080}
        height={1920}
      />
    </>
  );
};
