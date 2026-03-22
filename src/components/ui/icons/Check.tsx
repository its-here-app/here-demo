interface Props {
  focus?: boolean;
  className?: string;
}

export function Check({ focus = false, className }: Props) {
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
          <path d="M18.314 6.99976L19.3746 8.06042L9.61327 17.8218L8.55261 16.7611L18.314 6.99976Z" fill="currentColor" />
          <path d="M5.02539 13.2317L6.08605 12.171L10.3287 16.4137L9.26803 17.4743L5.02539 13.2317Z" fill="currentColor" />
        </>
      ) : (
        <>
          <path d="M18.314 6.99976L19.0211 7.70686L9.25972 17.4682L8.55261 16.7611L18.314 6.99976Z" fill="currentColor" />
          <path d="M5.02539 13.2317L5.7325 12.5246L9.97514 16.7672L9.26803 17.4743L5.02539 13.2317Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
