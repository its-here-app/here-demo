interface Props {
  focus?: boolean;
  className?: string;
}

export function Share({ focus, className }: Props) {
  if (focus) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M16 10C17.1046 10 18 10.8954 18 12V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V12C6 10.8954 6.89543 10 8 10H9.5V11.5H8C7.72386 11.5 7.5 11.7239 7.5 12V18C7.5 18.2761 7.72386 18.5 8 18.5H16C16.2761 18.5 16.5 18.2761 16.5 18V12C16.5 11.7239 16.2761 11.5 16 11.5H14.5V10H16Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.75 5L12.75 15L11.25 15L11.25 5L12.75 5Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.1716 7.99226L11.9995 4.00007L10.916 5.03687L15.0881 9.02906L16.1716 7.99226Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.82702 7.99487L11.9983 4.0035L13.082 5.04053L8.91078 9.0319L7.82702 7.99487Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 10C17.1046 10 18 10.8954 18 12V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V12C6 10.8954 6.89543 10 8 10H9.5V11H8C7.44772 11 7 11.4477 7 12V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V12C17 11.4477 16.5523 11 16 11H14.5V10H16Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5024 5L12.5024 15H11.5024L11.5025 5H12.5024Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.1741 7.99219L12.002 4L11.2795 4.69136L15.4516 8.68355L16.1741 7.99219Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.83008 7.99479L12.0013 4.00342L12.7238 4.69477L8.55259 8.68614L7.83008 7.99479Z"
        fill="currentColor"
      />
    </svg>
  );
}
