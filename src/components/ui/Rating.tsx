interface RatingProps {
  rating: number;
  reviewCount?: number;
}

export function Rating({ rating, reviewCount }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-body-xs text-grey">{rating}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 9.15877L9.708 11.396L8.724 7.17947L12 4.34247L7.686 3.9766L6 0L4.314 3.9766L0 4.34247L3.276 7.17947L2.292 11.396L6 9.15877Z" fill="#1169EE"/>
      </svg>
      {reviewCount != null && (
        <span className="text-body-xs text-grey">({reviewCount})</span>
      )}
    </div>
  );
}
