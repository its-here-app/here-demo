interface Props {
  focus?: boolean;
  className?: string;
}

export function Copy({ focus = false, className }: Props) {
  const id = "copy-mask";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {focus ? (
        <>
          <rect x="5.75" y="8.75" width="8.5" height="9.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
          <mask id={id} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="8" y="5" width="11" height="13">
            <path d="M15 8.75H8.5V5H19V17.25H15V8.75Z" fill="#D9D9D9" />
          </mask>
          <g mask={`url(#${id})`}>
            <rect x="9.75" y="5.75" width="8.5" height="9.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
          </g>
        </>
      ) : (
        <>
          <rect x="5.5" y="8.5" width="9" height="10" rx="1.5" stroke="currentColor" />
          <mask id={id} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="8" y="5" width="11" height="13">
            <path d="M15 8.75H8.5V5H19V17.25H15V8.75Z" fill="#D9D9D9" />
          </mask>
          <g mask={`url(#${id})`}>
            <path d="M11 5.5H17C17.8284 5.5 18.5 6.17157 18.5 7V14C18.5 14.8284 17.8284 15.5 17 15.5H11C10.1716 15.5 9.5 14.8284 9.5 14V7C9.5 6.17157 10.1716 5.5 11 5.5Z" stroke="currentColor" />
          </g>
        </>
      )}
    </svg>
  );
}
