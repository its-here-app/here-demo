interface Props {
  focus?: boolean;
  className?: string;
}

export function Search({ focus = false, className }: Props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      {focus ? (
        <>
          <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
          <line x1="19.4696" y1="19.5303" x2="15.4694" y2="15.5296" stroke="currentColor" strokeWidth="1.5" />
        </>
      ) : (
        <>
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" />
          <line x1="19.6464" y1="19.3535" x2="15.6462" y2="15.3529" stroke="currentColor" />
        </>
      )}
    </svg>
  );
}
