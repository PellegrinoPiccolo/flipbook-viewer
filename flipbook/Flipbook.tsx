import { useState, type CSSProperties } from "react";
import { TransformComponent } from "react-zoom-pan-pinch";
import FlipbookLoader from "./FlipbookLoader";
import { useRefSize } from "../hooks/useRefSize";
import { cn } from "cn";
import type {
  FlipbookRef,
  PdfDetails,
  SetViewerStates,
  ViewerStates,
} from "../types";

type FlipbookProps = {
  flipbookRef: FlipbookRef;
  pdfDetails: PdfDetails;
  viewerStates: ViewerStates;
  setViewerStates: SetViewerStates;
  isFullscreen: boolean;
};

const Flipbook = ({
  flipbookRef,
  pdfDetails,
  viewerStates,
  setViewerStates,
  isFullscreen,
}: FlipbookProps) => {
  const { ref, width, height } = useRefSize<HTMLDivElement>();
  const [viewRange, setViewRange] = useState<[number, number]>([0, 4]);

  // Two pages side by side, as large as the container allows
  const scale =
    width && height
      ? Math.min(width / (2 * pdfDetails.width), height / pdfDetails.height)
      : 0;
  const wrapperCss: CSSProperties = {
    width: `${pdfDetails.width * scale * 2}px`,
    height: `${pdfDetails.height * scale}px`,
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-[15rem] sm:h-[20rem] lg:h-[28rem] xl:h-[30rem] w-full bg-transparent flex justify-center items-center overflow-hidden",
        isFullscreen &&
          "h-[calc(100dvh-5.163rem)] sm:h-[calc(100dvh-5.163rem)] lg:h-[calc(100dvh-5.163rem)] xl:h-[calc(100dvh-4.66rem)]",
      )}
    >
      <TransformComponent
        wrapperStyle={{ width: "100%", height: "100%" }}
        contentStyle={{ width: "100%", height: "100%" }}
      >
        <div className="overflow-hidden flex justify-center items-center h-full w-full">
          {scale > 0 && (
            <div style={wrapperCss}>
              <FlipbookLoader
                flipbookRef={flipbookRef}
                pdfDetails={pdfDetails}
                scale={scale}
                viewRange={viewRange}
                setViewRange={setViewRange}
                viewerStates={viewerStates}
                setViewerStates={setViewerStates}
              />
            </div>
          )}
        </div>
      </TransformComponent>
    </div>
  );
};

export default Flipbook;
