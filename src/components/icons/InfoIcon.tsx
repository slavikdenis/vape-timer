import { SVGProps } from 'react';

function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M12 10a1 1 0 00-1 1v6a1 1 0 002 0v-6a1 1 0 00-1-1zm0-4a1.25 1.25 0 101.25 1.25A1.25 1.25 0 0012 6z" />
    </svg>
  );
}

export default InfoIcon;
