import Options from "@/components/Options/Options";
import Response from "@/components/Response/Response";
import { useHttpStore } from "@/store/useHttpStore";
import { FC } from "react";

const FlipCard: FC = () => {
  const cardMode = useHttpStore((state) => state.cardMode);

  return (
    <div className="flex items-center justify-center">
      <div className="perspective-1000 w-full">
        <div
          className="relative w-full  transition-transform duration-700 transform-style-3d"
          style={{
            transformStyle: "preserve-3d",
            transform: cardMode === "response" ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: "hidden" }}>
            <Options />
          </div>

          <div
            className="absolute w-full h-full backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <Response />
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default FlipCard;
