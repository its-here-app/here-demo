interface Props {
  className?: string;
}

export function World({ className }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M19 12.5H5V11.5H19V12.5Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M11.5 19L11.5 5L12.5 5L12.5 19L11.5 19Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M17.082 8.97206C13.7602 8.02298 10.2391 8.02299 6.91732 8.97206L5.13703 9.48072L4.8623 8.51919L6.6426 8.01054C10.1439 7.01016 13.8554 7.01016 17.3567 8.01054L19.137 8.51919L18.8623 9.48072L17.082 8.97206Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M6.91897 14.7691C10.2407 15.7182 13.7619 15.7182 17.0837 14.7691L18.864 14.2605L19.1387 15.222L17.3584 15.7307C13.8571 16.7311 10.1456 16.7311 6.64425 15.7307L4.86395 15.222L5.13867 14.2605L6.91897 14.7691Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.10243 6.7886C8.15336 10.1104 8.15336 13.6315 9.10243 16.9533L9.61109 18.7336L8.64956 19.0083L8.14091 17.228C7.14053 13.7267 7.14053 10.0152 8.14091 6.51388L8.64956 4.73358L9.61109 5.0083L9.10243 6.7886Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.8995 16.9526C15.8486 13.6308 15.8486 10.1097 14.8995 6.78793L14.3909 5.00763L15.3524 4.73291L15.861 6.51321C16.8614 10.0145 16.8614 13.726 15.861 17.2273L15.3524 19.0076L14.3909 18.7329L14.8995 16.9526Z" fill="currentColor" />
    </svg>
  );
}
