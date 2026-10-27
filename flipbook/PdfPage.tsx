import { memo, type Ref } from "react";
import { Page } from "react-pdf";
import { cn } from "cn";

// react-pageflip measures every page through the ref it passes to its children
type PdfPageProps = {
  ref?: Ref<HTMLDivElement>;
  page: number;
  height: number;
  zoomScale: number;
  isPageInView: boolean;
  isPageInViewRange: boolean;
};

const PdfPage = ({
  ref,
  page,
  height,
  zoomScale,
  isPageInView,
  isPageInViewRange,
}: PdfPageProps) => {
  return (
    <div
      ref={ref}
      className={cn(page % 2 === 0 ? "bg-white" : "bg-neutral-100")}
    >
      {isPageInViewRange && (
        <Page
          devicePixelRatio={
            isPageInView && zoomScale > 1.7
              ? Math.min(zoomScale * window.devicePixelRatio, 5)
              : window.devicePixelRatio
          }
          height={height}
          pageNumber={page}
          loading={<></>}
        />
      )}
    </div>
  );
};

export default memo(PdfPage);
