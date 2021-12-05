import styled from '@emotion/styled';
import { memo, useMemo } from 'react';

const RotatedSvg = styled.svg`
  transform: rotate(-90deg);
`;

const ActiveCircle = styled.circle`
  transition: dash 0.1s linear;
`;

type CircleProgressProps = {
  progress: number; // 0 -100
  size: number;
  strokeWidth: number;
  strokeColors: {
    active: string;
    activeOpacity?: number;
    bg: string;
    bgOpacity?: number;
  };
};

const CircleProgress = ({
  progress,
  size,
  strokeWidth,
  strokeColors,
}: CircleProgressProps) => {
  // Calculations
  const { r, c, initStroke } = useMemo(() => {
    const radius = size / 2;

    return {
      r: radius - strokeWidth,
      c: radius,
      initStroke: 2 * Math.PI * (radius - strokeWidth),
    };
  }, [size, strokeWidth]);

  return (
    <RotatedSvg width={size} height={size}>
      <g>
        <title>Circle Progress</title>
        <circle
          id="circle-bg"
          r={r}
          cy={c}
          cx={c}
          strokeWidth={strokeWidth}
          stroke={strokeColors.bg}
          strokeOpacity={strokeColors.bgOpacity ?? 0.1}
          strokeLinecap="round"
          fill="none"
        />

        <ActiveCircle
          id="circle"
          r={r}
          cy={c}
          cx={c}
          strokeWidth={strokeWidth}
          stroke={strokeColors.active}
          strokeOpacity={strokeColors.activeOpacity ?? 1}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={initStroke}
          strokeDashoffset={((100 - progress) * initStroke) / 100}
        />
      </g>
    </RotatedSvg>
  );
};

export default memo(CircleProgress);
