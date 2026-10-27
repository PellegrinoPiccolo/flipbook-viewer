import { useCallback, type Dispatch, type SetStateAction } from "react";
import HTMLFlipBook from "react-pageflip";
import PdfPage from "./PdfPage";
import { useDebounce } from "../hooks/useDebounce";
import { useScreenSize } from "../hooks/useScreenSize";
import { cn } from "cn";
import type {
  FlipbookRef,
  PdfDetails,
  SetViewerStates,
  ViewerStates,
} from "../types";

type FlipbookLoaderProps = {
  flipbookRef: FlipbookRef;
  pdfDetails: PdfDetails;
  scale: number;
  viewerStates: ViewerStates;
  setViewerStates: SetViewerStates;
  viewRange: [number, number];
  setViewRange: Dispatch<SetStateAction<[number, number]>>;
};

const FlipbookLoader = ({
  flipbookRef,
  pdfDetails,
  scale,
  viewerStates,
  setViewerStates,
  viewRange,
  setViewRange,
}: FlipbookLoaderProps) => {
  const { width } = useScreenSize();
  const debouncedZoom = useDebounce(viewerStates.zoomScale, 500);

  // Only pages close to the current one are rendered
  const isPageInViewRange = (index: number) =>
    index >= viewRange[0] && index <= viewRange[1];
  const isPageInView = (index: number) =>
    viewerStates.currentPageIndex === index ||
    viewerStates.currentPageIndex + 1 === index;

  const onFlip = useCallback(
    (e: { data: number }) => {
      if (e.data > viewerStates.currentPageIndex) {
        setViewRange([
          viewRange[0],
          Math.max(Math.min(e.data + 4, pdfDetails.totalPages), viewRange[1]),
        ]);
      } else if (e.data < viewerStates.currentPageIndex) {
        setViewRange([
          Math.min(Math.max(e.data - 4, 0), viewRange[0]),
          viewRange[1],
        ]);
      }
      setViewerStates((prev) => ({ ...prev, currentPageIndex: e.data }));
    },
    [
      viewerStates.currentPageIndex,
      viewRange,
      setViewRange,
      setViewerStates,
      pdfDetails.totalPages,
    ],
  );

  return (
    <div className="relative">
      <HTMLFlipBook
        ref={flipbookRef}
        key={scale}
        startPage={viewerStates.currentPageIndex}
        width={pdfDetails.width * scale * 5}
        height={pdfDetails.height * scale * 5}
        size="stretch"
        minWidth={0}
        maxWidth={0}
        minHeight={0}
        maxHeight={0}
        drawShadow={false}
        flippingTime={700}
        usePortrait={false}
        startZIndex={0}
        autoSize
        maxShadowOpacity={1}
        showCover
        mobileScrollSupport
        clickEventForward
        useMouseEvents
        swipeDistance={30}
        showPageCorners={false}
        disableFlipByClick={width < 768}
        onFlip={onFlip}
        style={{}}
        className={cn(viewerStates.zoomScale > 1 && "pointer-events-none")}
      >
        {Array.from({ length: pdfDetails.totalPages }, (_, index) => (
          <PdfPage
            key={index}
            height={pdfDetails.height * scale}
            zoomScale={debouncedZoom}
            page={index + 1}
            isPageInViewRange={isPageInViewRange(index)}
            isPageInView={isPageInView(index)}
          />
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default FlipbookLoader;
