interface CloudProps {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  puffSeed?: number;
}

function Cloud({ x, y, scale = 1, flip = false, puffSeed = 0 }: CloudProps) {
  const flipTransform = flip ? " scale(-1, 1) translate(-150, 0)" : "";
  const puffOffsets = [
    { cx: 42, cy: 44, rx: 36, ry: 30 },
    { cx: 76, cy: 36, rx: 42, ry: 34 },
    { cx: 108, cy: 42, rx: 34, ry: 28 },
    { cx: 58, cy: 26, rx: 30, ry: 24 },
    { cx: 88, cy: 22, rx: 26, ry: 20 },
  ];

  const shiftedPuffs = puffOffsets.map((puff, index) => {
    const drift = ((puffSeed + index) % 3) - 1;
    return {
      ...puff,
      cx: puff.cx + drift * 4,
      cy: puff.cy + ((index + puffSeed) % 2) * 2,
    };
  });

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})${flipTransform}`}>
      <ellipse
        cx="74"
        cy="62"
        rx="88"
        ry="20"
        fill="url(#cloud-ground-shadow)"
        opacity="0.55"
      />

      <g filter="url(#cloud-volume-shadow)">
        {shiftedPuffs.map((puff) => (
          <ellipse
            key={`${puff.cx}-${puff.cy}`}
            cx={puff.cx}
            cy={puff.cy}
            rx={puff.rx}
            ry={puff.ry}
            fill="url(#cloud-body)"
          />
        ))}
        <ellipse
          cx="74"
          cy="54"
          rx="78"
          ry="20"
          fill="url(#cloud-body)"
        />
        <ellipse
          cx="62"
          cy="48"
          rx="64"
          ry="16"
          fill="url(#cloud-base)"
        />
      </g>

      <ellipse
        cx="52"
        cy="24"
        rx="34"
        ry="12"
        fill="url(#cloud-highlight)"
        opacity="0.72"
      />
      <ellipse
        cx="92"
        cy="28"
        rx="24"
        ry="10"
        fill="#ffffff"
        opacity="0.38"
      />

      <ellipse
        cx="118"
        cy="46"
        rx="14"
        ry="10"
        fill="url(#cloud-wisp)"
        opacity="0.65"
      />
      <ellipse
        cx="24"
        cy="42"
        rx="12"
        ry="9"
        fill="url(#cloud-wisp)"
        opacity="0.5"
      />
    </g>
  );
}

export default function HeaderClouds() {
  return (
    <div className="home-feed__clouds" aria-hidden="true">
      <svg
        className="home-feed__clouds-svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="header-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a9fd4" />
            <stop offset="50%" stopColor="#8ec5ef" />
            <stop offset="100%" stopColor="#e8f4fc" />
          </linearGradient>

          <radialGradient id="cloud-body" cx="42%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f6fbff" />
            <stop offset="82%" stopColor="#e2edf7" />
            <stop offset="100%" stopColor="#c8dced" />
          </radialGradient>

          <radialGradient id="cloud-base" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#f0f7fc" />
            <stop offset="100%" stopColor="#b8cfe0" />
          </radialGradient>

          <radialGradient id="cloud-highlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cloud-wisp" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cloud-ground-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d7aad" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3d7aad" stopOpacity="0" />
          </radialGradient>

          <filter
            id="cloud-volume-shadow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="5"
              floodColor="#2f6a96"
              floodOpacity="0.28"
            />
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.5"
              floodColor="#ffffff"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        <rect width="1200" height="120" fill="url(#header-sky)" />

        <Cloud x={200} y={34} scale={0.78} puffSeed={1} />
        <Cloud x={455} y={22} scale={0.95} flip puffSeed={3} />
        <Cloud x={735} y={38} scale={0.72} puffSeed={2} />
        <Cloud x={930} y={26} scale={0.86} flip puffSeed={4} />

        <image
          className="home-feed__header-icon"
          href={`${process.env.PUBLIC_URL}/callio-figures.png`}
          x="640"
          y="-20"
          width="607"
          height="212"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </div>
  );
}
