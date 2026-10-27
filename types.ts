import type { Dispatch, RefObject, SetStateAction } from "react";

export type PdfDetails = {
  totalPages: number;
  width: number;
  height: number;
};

export type ViewerStates = {
  currentPageIndex: number;
  zoomScale: number;
};

export type SetViewerStates = Dispatch<SetStateAction<ViewerStates>>;

// Subset of the page-flip API used by the toolbar (react-pageflip ships no types for it)
type PageFlipApi = {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (pageIndex: number) => void;
  turnToNextPage: () => void;
  turnToPrevPage: () => void;
};

export type FlipbookHandle = { pageFlip: () => PageFlipApi | undefined };

export type FlipbookRef = RefObject<FlipbookHandle | null>;
