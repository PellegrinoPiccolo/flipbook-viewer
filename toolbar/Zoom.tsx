import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useControls } from "react-zoom-pan-pinch";
import ToolbarButton from "./ToolbarButton";

type ZoomProps = {
  zoomScale: number;
  screenWidth: number;
};

const Zoom = ({ zoomScale, screenWidth }: ZoomProps) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  if (screenWidth <= 768) return null;

  return (
    <>
      <ToolbarButton
        onClick={() => zoomOut(0.25)}
        disabled={zoomScale === 1}
        aria-label="Riduci zoom"
      >
        <ZoomOut className="size-4 min-w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => zoomIn(0.25)}
        disabled={zoomScale >= 5}
        aria-label="Aumenta zoom"
      >
        <ZoomIn className="size-4 min-w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => resetTransform()}
        aria-label="Ripristina zoom"
      >
        <RotateCcw className="size-4 min-w-4" />
      </ToolbarButton>
    </>
  );
};

export default Zoom;
