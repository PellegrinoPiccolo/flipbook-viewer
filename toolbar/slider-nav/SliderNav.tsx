import { useCallback } from "react";
import Slider from "./Slider";
import type { FlipbookRef, PdfDetails, ViewerStates } from "../../types";

type SliderNavProps = {
  flipbookRef: FlipbookRef;
  pdfDetails: PdfDetails;
  viewerStates: ViewerStates;
};

const SliderNav = ({
  flipbookRef,
  pdfDetails,
  viewerStates,
}: SliderNavProps) => {
  const { totalPages } = pdfDetails;
  const totalSlides =
    totalPages % 2 === 0 ? totalPages / 2 + 1 : (totalPages - 1) / 2 + 1;
  const currentSlide = Math.max(
    1,
    Math.min(totalSlides, Math.floor((viewerStates.currentPageIndex + 3) / 2)),
  );

  const onSlideChange = useCallback(
    (slide: number) => {
      flipbookRef.current?.pageFlip()?.turnToPage(Math.max(0, slide * 2 - 3));
    },
    [flipbookRef],
  );

  return (
    <Slider
      totalPages={totalPages}
      currentSlide={currentSlide}
      onSlideChange={onSlideChange}
      maxSlide={totalSlides}
    />
  );
};

export default SliderNav;
