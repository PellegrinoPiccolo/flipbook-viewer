import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type MouseEvent,
} from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import HoverItem from "./HoverItem";
import { useDebounce } from "../../hooks/useDebounce";
import { cn } from "cn";

type SliderProps = {
  maxSlide: number;
  currentSlide: number;
  onSlideChange: (slide: number) => void;
  totalPages: number;
};

const Slider = ({
  maxSlide,
  currentSlide,
  onSlideChange,
  totalPages,
}: SliderProps) => {
  const [value, setValue] = useState(currentSlide);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [thumbPosition, setThumbPosition] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const slideAt = (offsetX: number, width: number) =>
    Math.min(
      Math.max(1, Math.round((offsetX / width) * (maxSlide - 1) + 1)),
      maxSlide,
    );

  const moveTooltip = (offsetX: number, sliderWidth: number) => {
    const tooltipWidth = tooltipRef.current?.getBoundingClientRect().width ?? 0;
    setTooltipLeft(
      Math.max(
        0,
        Math.min(offsetX - tooltipWidth / 2, sliderWidth - tooltipWidth),
      ),
    );
  };

  useEffect(() => {
    const updateThumbPosition = () => {
      if (sliderRef.current && !dragging) {
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        setThumbPosition(
          maxSlide > 1 ? ((value - 1) / (maxSlide - 1)) * sliderWidth : 0,
        );
      }
    };
    updateThumbPosition();
    window.addEventListener("resize", updateThumbPosition);
    return () => window.removeEventListener("resize", updateThumbPosition);
  }, [value, maxSlide, dragging]);

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    if (!sliderRef.current) return;
    const sliderWidth = sliderRef.current.getBoundingClientRect().width;
    const newValue = slideAt(data.x, sliderWidth - data.node.clientWidth);
    setValue(newValue);
    setHoverValue(newValue);
    moveTooltip(data.x, sliderWidth);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setValue(slideAt(e.clientX - rect.left, rect.width));
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current || dragging) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setHoverValue(slideAt(e.clientX - rect.left, rect.width));
    moveTooltip(e.clientX - rect.left, rect.width);
  };

  const handlePointerLeave = () => setHoverValue(null);

  // Follow the book when it is flipped from elsewhere (arrows, keyboard, swipe)
  const [prevCurrentSlide, setPrevCurrentSlide] = useState(currentSlide);
  if (currentSlide !== prevCurrentSlide) {
    setPrevCurrentSlide(currentSlide);
    setValue(currentSlide);
  }

  const debouncedValue = useDebounce(value, 500);
  useEffect(() => {
    onSlideChange(debouncedValue);
  }, [debouncedValue, onSlideChange]);

  return (
    <div className="py-4">
      <div
        ref={sliderRef}
        className="relative w-full h-1 bg-neutral-200 rounded-full"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
      >
        <Draggable
          nodeRef={thumbRef}
          axis="x"
          bounds="parent"
          position={{ x: thumbPosition, y: 0 }}
          onStart={() => setDragging(true)}
          onDrag={handleDrag}
          onStop={() => {
            setDragging(false);
            setHoverValue(null);
          }}
        >
          <div
            ref={thumbRef}
            className="absolute z-20 size-1 bg-(--flipbook-accent) rounded-full cursor-pointer"
          >
            <div
              className={cn(
                "size-3 hover:size-4 bg-(--flipbook-accent) absolute -top-1 hover:-top-1.5 -left-1 hover:-left-1.5 rounded-full transition-all",
                dragging && "size-3 -left-1.5 -top-1.5",
              )}
            />
          </div>
        </Draggable>
        <div
          className="absolute inset-0 cursor-pointer w-full h-3 top-1/2 -translate-y-1/2 bg-transparent"
          onClick={handleClick}
        />
        <div
          ref={tooltipRef}
          className={cn(
            "bg-(--flipbook-ink)/80 backdrop-blur-sm p-2 w-fit h-fit",
            hoverValue === null &&
              "opacity-0 w-0 h-0 select-none pointer-events-none",
          )}
          style={{ position: "absolute", left: tooltipLeft, bottom: "20px" }}
        >
          {hoverValue !== null && (
            <HoverItem slide={hoverValue} totalPages={totalPages} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
