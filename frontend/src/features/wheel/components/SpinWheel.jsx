import { useEffect, useRef, useState } from 'react';

const COLORS = [
  '#FF4F87', '#FF8FB1', '#FFD6E5',
  '#FF5C7A', '#FFC542', '#00C896',
  '#9B8CFF', '#66C7FF', '#FF8C42',
];

export default function SpinWheel({ recipes = [], spinning = false, winnerIndex = 0, spinDuration = 3000 }) {
  const [rotation, setRotation] = useState(0);
  const prevSpinning = useRef(false);

  const count = Math.min(recipes.length, 12);
  const sliceAngle = 360 / count;

  useEffect(() => {
    if (spinning && !prevSpinning.current) {
      const landAngle = 360 - (winnerIndex * sliceAngle + sliceAngle / 2);
      setRotation((prev) => prev + 360 * 5 + landAngle);
    }
    prevSpinning.current = spinning;
  }, [spinning, winnerIndex, sliceAngle]);

  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - 4;

  const polarToCartesian = (angleDeg, radius = r) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const segmentPath = (index) => {
    const start = index * sliceAngle;
    const end = start + sliceAngle;
    const p1 = polarToCartesian(start);
    const p2 = polarToCartesian(end);
    const large = sliceAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`;
  };

  const labelPos = (index) => {
    const angle = index * sliceAngle + sliceAngle / 2;
    return polarToCartesian(angle, r * 0.65);
  };

  const truncate = (str, max = 10) =>
    str && str.length > max ? str.slice(0, max) + '…' : str;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Pointer */}
      <div
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1"
        style={{
          width: 0,
          height: 0,
          borderTop: '10px solid transparent',
          borderBottom: '10px solid transparent',
          borderRight: '22px solid #FF4F87',
        }}
      />

      {/* Wheel */}
      <svg
        width={size}
        height={size}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 1)` : 'none',
          borderRadius: '50%',
          boxShadow: '0 8px 32px rgba(255,79,135,0.25)',
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const recipe = recipes[i];
          const label = recipe ? truncate(recipe.title, 9) : '';
          const lp = labelPos(i);
          return (
            <g key={i}>
              <path d={segmentPath(i)} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={2} />
              <text
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontFamily="Poppins, sans-serif"
                fontWeight={600}
                fill="#fff"
                transform={`rotate(${i * sliceAngle + sliceAngle / 2}, ${lp.x}, ${lp.y})`}
              >
                {label}
              </text>
            </g>
          );
        })}
        {/* Center circle */}
        <circle cx={cx} cy={cy} r={22} fill="#fff" stroke="#FF4F87" strokeWidth={3} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={18}>
          🍽️
        </text>
      </svg>
    </div>
  );
}