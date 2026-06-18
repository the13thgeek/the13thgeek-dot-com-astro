import React from 'react';

interface ReactIconProps {
  id: string;
  className?: string;
  decorative: boolean;
  width?: string;
  height?: string;
}

const ReactIcon = ({ id, className, decorative = false, width = "24", height = "24" } : ReactIconProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? "presentation" : undefined}
    >
      <use href={`/assets/global/icons.svg?id=67#${id}`} />
    </svg>
  )
}

export default ReactIcon