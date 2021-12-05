import { memo, SVGProps } from 'react';

function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M176 96h16v320h-16zM320 96h16v320h-16z"
      />
    </svg>
  );
}

export default memo(PauseIcon);
