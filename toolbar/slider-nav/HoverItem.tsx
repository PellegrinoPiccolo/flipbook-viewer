import { memo } from "react";
import { Page } from "react-pdf";

type HoverItemProps = {
  slide: number;
  totalPages: number;
};

// Slide 1 is the cover alone, every other slide is a spread of two pages
const HoverItem = ({ slide, totalPages }: HoverItemProps) => {
  const pages =
    slide === 1
      ? [1]
      : [slide * 2 - 2, slide * 2 - 1].filter((page) => page <= totalPages);

  return (
    <div>
      <p className="text-xs text-white pb-1">
        {pages.length === 1
          ? `Pagina ${pages[0]}`
          : `Pagine ${pages.join("-")}`}
      </p>
      <div className="flex overflow-hidden">
        {pages.map((page) => (
          <Page
            key={page}
            pageNumber={page}
            width={110}
            renderAnnotationLayer={false}
            renderForms={false}
            renderTextLayer={false}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(HoverItem);
