interface Props {
  focus?: boolean;
  className?: string;
}

export function Close({ focus = false, className }: Props) {
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
          <path fillRule="evenodd" clipRule="evenodd" d="M17.4699 18.5264L5.47991 6.53645L6.54004 5.47632L18.53 17.4663L17.4699 18.5264Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M6.53279 18.5369L18.5328 6.53694L17.4707 5.47485L5.4707 17.4749L6.53279 18.5369Z" fill="currentColor" />
        </>
      ) : (
        <>
          <path fillRule="evenodd" clipRule="evenodd" d="M17.6462 18.3499L5.65618 6.35994L6.36328 5.65283L18.3533 17.6428L17.6462 18.3499Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M6.35554 18.3595L18.3555 6.35945L17.6484 5.65234L5.64844 17.6523L6.35554 18.3595Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
