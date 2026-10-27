import "./style.css";

const PdfLoading = ({ text }: { text: string }) => {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center h-full w-full bg-white">
      <div className="flex items-center gap-3 p-2">
        <div className="w-14 h-fit flex items-center justify-end relative animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="var(--flipbook-accent)"
            viewBox="0 0 126 75"
            className="w-full h-auto shadow-sm"
          >
            <rect
              strokeWidth="3"
              stroke="white"
              rx="7.5"
              height="70"
              width="121"
              y="2.5"
              x="2.5"
            />
            <line strokeWidth="2" stroke="white" y2="75" x2="63.5" x1="63.5" />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              stroke="white"
              d="M25 20H50"
            />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              stroke="white"
              d="M101 20H76"
            />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              stroke="white"
              d="M16 30L50 30"
            />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              stroke="white"
              d="M110 30L76 30"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff74"
            viewBox="0 0 65 75"
            className="pdf-loading-page w-1/2 h-auto absolute"
          >
            <path
              strokeLinecap="round"
              strokeWidth="2"
              stroke="var(--flipbook-accent)"
              d="M40 20H15"
            />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              stroke="var(--flipbook-accent)"
              d="M49 30L15 30"
            />
            <path
              strokeWidth="2"
              stroke="var(--flipbook-accent)"
              d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"
            />
          </svg>
        </div>
        <p className="text-base font-semibold font-(family-name:--flipbook-font) uppercase tracking-wide text-(--flipbook-ink)">
          {text}
        </p>
      </div>
    </div>
  );
};

export default PdfLoading;
