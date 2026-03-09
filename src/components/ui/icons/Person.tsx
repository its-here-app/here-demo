interface Props {
  focus?: boolean;
  className?: string;
}

export function Person({ focus, className }: Props) {
  if (focus) {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle
          cx="10.0003"
          cy="6.66732"
          r="2.91667"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.833333"
        />
        <path
          d="M10.4854 11.2588C12.7937 11.3457 14.2706 12.0717 15.1593 13.0547C16.0942 14.0892 16.3229 15.348 16.2501 16.2686V16.4873H16.2325L16.2169 16.667H3.79598L3.76376 16.2852C3.68683 15.362 3.91654 14.0939 4.86044 13.0537C5.81133 12.0058 7.43109 11.2501 10.0128 11.25L10.4854 11.2588Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="10.0003"
        cy="6.66732"
        r="2.91667"
        stroke="currentColor"
        strokeWidth="0.833333"
      />
      <path
        d="M10.0127 16.2493H4.17938C4.04049 14.5827 5.01274 11.6662 10.0127 11.666C15.0127 11.666 15.9725 14.5829 15.8337 16.2496H10.0003"
        stroke="currentColor"
        strokeWidth="0.833333"
      />
    </svg>
  );
}
