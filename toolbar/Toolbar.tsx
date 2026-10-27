import { useEffect } from "react";
import keyboardjs from "keyboardjs";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import SliderNav from "./slider-nav/SliderNav";
import ToolbarButton from "./ToolbarButton";
import Zoom from "./Zoom";
import { useScreenSize } from "../hooks/useScreenSize";
import type { FlipbookRef, PdfDetails, ViewerStates } from "../types";

type ToolbarProps = {
  flipbookRef: FlipbookRef;
  pdfDetails: PdfDetails;
  viewerStates: ViewerStates;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
};

const Toolbar = ({
  flipbookRef,
  pdfDetails,
  viewerStates,
  isFullscreen,
  onToggleFullscreen,
}: ToolbarProps) => {
  const { width: screenWidth } = useScreenSize();
  const { currentPageIndex } = viewerStates;
  const pageNumber = currentPageIndex + 1;
  const pagesInFlipView =
    pageNumber % 2 === 0 && pageNumber !== pdfDetails.totalPages
      ? `${pageNumber} - ${pageNumber + 1}`
      : pageNumber;

  // On mobile there is a single page at a time, so the arrows move page by page
  const goPrev = () => {
    const pageFlip = flipbookRef.current?.pageFlip();
    if (screenWidth < 768) pageFlip?.turnToPrevPage();
    else pageFlip?.flipPrev();
  };

  const goNext = () => {
    const pageFlip = flipbookRef.current?.pageFlip();
    if (screenWidth < 768) pageFlip?.turnToNextPage();
    else pageFlip?.flipNext();
  };

  useEffect(() => {
    const handleRight = () => flipbookRef.current?.pageFlip()?.flipNext();
    const handleLeft = () => flipbookRef.current?.pageFlip()?.flipPrev();

    keyboardjs.bind("right", null, handleRight);
    keyboardjs.bind("left", null, handleLeft);
    return () => {
      keyboardjs.unbind("right", null, handleRight);
      keyboardjs.unbind("left", null, handleLeft);
    };
  }, [flipbookRef]);

  return (
    <div className="px-3 w-full bg-white">
      <SliderNav
        flipbookRef={flipbookRef}
        pdfDetails={pdfDetails}
        viewerStates={viewerStates}
      />
      <div className="flex items-center gap-2 pb-2 max-xl:pt-2">
        <div className="hidden lg:block flex-1" />
        <ToolbarButton
          onClick={goPrev}
          disabled={currentPageIndex === 0}
          aria-label="Pagina precedente"
        >
          <ChevronLeft className="size-4 min-w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={goNext}
          disabled={
            currentPageIndex === pdfDetails.totalPages - 1 ||
            currentPageIndex === pdfDetails.totalPages - 2
          }
          aria-label="Pagina successiva"
        >
          <ChevronRight className="size-4 min-w-4" />
        </ToolbarButton>
        <Zoom zoomScale={viewerStates.zoomScale} screenWidth={screenWidth} />
        <ToolbarButton
          onClick={onToggleFullscreen}
          aria-label={
            isFullscreen ? "Esci da schermo intero" : "Schermo intero"
          }
        >
          {isFullscreen ? (
            <Minimize className="size-4 min-w-4" />
          ) : (
            <Maximize className="size-4 min-w-4" />
          )}
        </ToolbarButton>
        <div className="flex-1" />
        {pdfDetails.totalPages > 0 && (
          <p className="text-sm font-medium text-(--flipbook-ink)">
            {pagesInFlipView} di {pdfDetails.totalPages}
          </p>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
