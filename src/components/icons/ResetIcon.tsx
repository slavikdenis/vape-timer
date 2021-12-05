import { memo, SVGProps } from 'react';

function ResetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 21 21"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6.5 3.5c-2.414 1.377-4 4.022-4 7a8 8 0 108-8" />
        <path d="M6.5 8.5v-5h-5" />
      </g>
    </svg>
  );
}

export default memo(ResetIcon);
