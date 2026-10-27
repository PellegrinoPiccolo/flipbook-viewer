"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { TransformWrapper } from "react-zoom-pan-pinch";
import screenfull from "screenfull";
import Flipbook from "./flipbook/Flipbook";
import PdfLoading from "./pdf-loading/PdfLoading";
import Toolbar from "./toolbar/Toolbar";
import { cn } from "cn";
import type { FlipbookHandle, PdfDetails, ViewerStates } from "./types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./style.css";

// Bundled with the site instead of loaded from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export type FlipbookViewerProps = {
  pdfUrl: string;
  className?: string;
  loadingText?: string;
  workerSrc?: string;
};

const FlipbookViewer = ({
  pdfUrl,
  className,
  loadingText = "Caricamento PDF…",
  workerSrc,
}: FlipbookViewerProps) => {
  if (workerSrc) pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const containerRef = useRef<HTMLDivElement>(null);
  const flipbookRef = useRef<FlipbookHandle>(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfDetails, setPdfDetails] = useState<PdfDetails | null>(null);
  const [viewerStates, setViewerStates] = useState<ViewerStates>({
    currentPageIndex: 0,
    zoomScale: 1,
  });
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);
  const isFullscreen = isNativeFullscreen || isFallbackFullscreen;

  useEffect(() => {
    if (!screenfull.isEnabled) return;
    const onChange = () => setIsNativeFullscreen(screenfull.isFullscreen);
    screenfull.on("change", onChange);
    return () => screenfull.off("change", onChange);
  }, []);

  useEffect(() => {
    if (!isFallbackFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFallbackFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFallbackFullscreen]);

  // Where the Fullscreen API is missing (iPhone Safari) the viewer covers the page instead
  const toggleFullscreen = useCallback(() => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current, { navigationUI: "hide" });
    } else {
      setIsFallbackFullscreen((prev) => !prev);
    }
  }, []);

  // The size of the first page sets the size of the whole book
  const onDocumentLoadSuccess = useCallback(
    async (document: PDFDocumentProxy) => {
      try {
        // page.view holds box coordinates, not a size: flyers often crop the cover out of a wider spread
        const { width, height } = (await document.getPage(1)).getViewport({
          scale: 1,
        });
        setPdfDetails({ totalPages: document.numPages, width, height });
      } catch (error) {
        console.error("Error loading document:", error);
      } finally {
        setPdfLoading(false);
      }
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "flipbook-viewer relative h-[20.163rem] sm:h-[25.163rem] lg:h-[33.163rem] xl:h-[34.66rem] bg-(--flipbook-ink) w-full overflow-hidden",
        className,
        isFallbackFullscreen &&
          "flipbook-fullscreen fixed inset-0 z-100 h-dvh sm:h-dvh lg:h-dvh xl:h-dvh",
      )}
    >
      {pdfLoading && <PdfLoading text={loadingText} />}
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error("Failed to load PDF:", error.message);
          setPdfLoading(false);
        }}
        loading={<></>}
      >
        {pdfDetails && !pdfLoading && (
          <TransformWrapper
            doubleClick={{ disabled: true }}
            pinch={{ step: 2 }}
            disablePadding={viewerStates.zoomScale <= 1}
            initialScale={1}
            minScale={1}
            maxScale={5}
            onTransformed={(_, state) =>
              setViewerStates((prev) => ({ ...prev, zoomScale: state.scale }))
            }
          >
            <div className="w-full relative bg-(--flipbook-ink) flex flex-col justify-between">
              <Flipbook
                flipbookRef={flipbookRef}
                pdfDetails={pdfDetails}
                viewerStates={viewerStates}
                setViewerStates={setViewerStates}
                isFullscreen={isFullscreen}
              />
              <Toolbar
                flipbookRef={flipbookRef}
                pdfDetails={pdfDetails}
                viewerStates={viewerStates}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
              />
            </div>
          </TransformWrapper>
        )}
      </Document>
    </div>
  );
};

export default FlipbookViewer;
