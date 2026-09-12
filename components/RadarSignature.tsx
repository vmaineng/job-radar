"use client";

const BLIPS: Array<[number, number]> = [
  [140, 260],
  [270, 150],
  [95, 130],
  [230, 300],
];

export default function RadarSignature() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 w-full h-full opacity-[0.15] motion-reduce:[&_animate]:hidden! motion-reduce:[&_animateTransform]:hidden!"
      aria-hidden="true"
    >
      <g stroke="white" fill="none" strokeWidth="1">
        <circle cx="200" cy="200" r="60" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="180" />
      </g>
      <line
        x1="200"
        y1="200"
        x2="200"
        y2="20"
        stroke="white"
        strokeWidth="1"
        opacity="0.4"
      />
      <g>
        <path
          d="M 200 200 L 200 20 A 180 180 0 0 1 260 45 Z"
          fill="white"
          opacity="0.25"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 200 200"
            to="360 200 200"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
      </g>
      {BLIPS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="white">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="6s"
            begin={`${i * 1.4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
