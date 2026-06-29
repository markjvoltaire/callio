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
            <stop offset="0%" stopColor="#ffb088" />
            <stop offset="50%" stopColor="#ffd4bc" />
            <stop offset="100%" stopColor="#fff8f4" />
          </linearGradient>
          <filter id="cloud-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#e8a88a" floodOpacity="0.32" />
          </filter>
          <filter id="cloud-shadow-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#e8a88a" floodOpacity="0.22" />
          </filter>
        </defs>

        <rect width="1200" height="120" fill="url(#header-sky)" />

        <g filter="url(#cloud-shadow-soft)" opacity="0.92">
          <path
            fill="#ffffff"
            d="M118,78c-18,0-34-8-44-21c-3,1-6,1-9,1c-14,0-25-11-25-25c0-1,0-2,0.2-3C22,24,8,38,8,55c0,22,18,40,40,40h70c22,0,40-18,40-40c0-19-13-35-31-39C124,11,112,0,98,0c-5,0-10,1-14,3C79,1,73,0,67,0C50,0,35,9,28,23C24,22,20,22,16,22C7,22,0,29,0,38c0,7,5,13,11,16C4,58,0,66,0,74c0,14,11,25,25,25h93c14,0,25-11,25-25c0-12-8-22-19-24C122,44,120,61,118,78z"
            transform="translate(40, 18) scale(0.55)"
          />
        </g>

        <g filter="url(#cloud-shadow)" opacity="0.98">
          <path
            fill="#ffffff"
            d="M118,78c-18,0-34-8-44-21c-3,1-6,1-9,1c-14,0-25-11-25-25c0-1,0-2,0.2-3C22,24,8,38,8,55c0,22,18,40,40,40h70c22,0,40-18,40-40c0-19-13-35-31-39C124,11,112,0,98,0c-5,0-10,1-14,3C79,1,73,0,67,0C50,0,35,9,28,23C24,22,20,22,16,22C7,22,0,29,0,38c0,7,5,13,11,16C4,58,0,66,0,74c0,14,11,25,25,25h93c14,0,25-11,25-25c0-12-8-22-19-24C122,44,120,61,118,78z"
            transform="translate(220, 32) scale(0.72)"
          />
        </g>

        <g filter="url(#cloud-shadow)" opacity="0.96">
          <path
            fill="#ffffff"
            d="M118,78c-18,0-34-8-44-21c-3,1-6,1-9,1c-14,0-25-11-25-25c0-1,0-2,0.2-3C22,24,8,38,8,55c0,22,18,40,40,40h70c22,0,40-18,40-40c0-19-13-35-31-39C124,11,112,0,98,0c-5,0-10,1-14,3C79,1,73,0,67,0C50,0,35,9,28,23C24,22,20,22,16,22C7,22,0,29,0,38c0,7,5,13,11,16C4,58,0,66,0,74c0,14,11,25,25,25h93c14,0,25-11,25-25c0-12-8-22-19-24C122,44,120,61,118,78z"
            transform="translate(480, 24) scale(0.85)"
          />
        </g>

        <g filter="url(#cloud-shadow-soft)" opacity="0.9">
          <path
            fill="#ffffff"
            d="M118,78c-18,0-34-8-44-21c-3,1-6,1-9,1c-14,0-25-11-25-25c0-1,0-2,0.2-3C22,24,8,38,8,55c0,22,18,40,40,40h70c22,0,40-18,40-40c0-19-13-35-31-39C124,11,112,0,98,0c-5,0-10,1-14,3C79,1,73,0,67,0C50,0,35,9,28,23C24,22,20,22,16,22C7,22,0,29,0,38c0,7,5,13,11,16C4,58,0,66,0,74c0,14,11,25,25,25h93c14,0,25-11,25-25c0-12-8-22-19-24C122,44,120,61,118,78z"
            transform="translate(760, 36) scale(0.68)"
          />
        </g>

        <g filter="url(#cloud-shadow)" opacity="0.94">
          <path
            fill="#ffffff"
            d="M118,78c-18,0-34-8-44-21c-3,1-6,1-9,1c-14,0-25-11-25-25c0-1,0-2,0.2-3C22,24,8,38,8,55c0,22,18,40,40,40h70c22,0,40-18,40-40c0-19-13-35-31-39C124,11,112,0,98,0c-5,0-10,1-14,3C79,1,73,0,67,0C50,0,35,9,28,23C24,22,20,22,16,22C7,22,0,29,0,38c0,7,5,13,11,16C4,58,0,66,0,74c0,14,11,25,25,25h93c14,0,25-11,25-25c0-12-8-22-19-24C122,44,120,61,118,78z"
            transform="translate(960, 28) scale(0.78)"
          />
        </g>
      </svg>
    </div>
  );
}
