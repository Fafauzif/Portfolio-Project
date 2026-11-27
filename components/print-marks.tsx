import './print-marks.css';

export function FoldMarks() {
  return (
    <svg className="fold-press-marks" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="fold-screen-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".65" fill="currentColor" />
        </pattern>
      </defs>
      <path d="M43 574 268 349h109L152 574z" fill="url(#fold-screen-dots)" opacity=".26" />
      <g className="fold-rules" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M56 510 406 160h286M56 529 413 172h286M56 548 420 184h286" />
        <path d="M69 440v48H22M429 109h24m-12-12v24M1103 565h48v-48M1058 583h22m-11-11v22" />
        <path d="M108 580h238l116-116" strokeDasharray="3 6" />
        <circle cx="101" cy="585" r="13" />
        <path d="M82 585h38m-19-19v38" />
      </g>
      <g className="fold-ink-patch" fill="currentColor">
        <path d="M122 495 334 283h38L160 495zM173 495l151-151h10L183 495zM202 495l88-88h4l-88 88z" />
      </g>
    </svg>
  );
}

const branches = [
  'M82 161 176 67h163',
  'M111 161 182 90h157',
  'M140 161 188 113h151',
  'M169 161 194 136h145',
];

export function DirectoryMarks() {
  return (
    <svg className="directory-press ink-reveal" viewBox="0 0 380 196" fill="none" aria-hidden="true" data-ink-reveal>
      <defs>
        <pattern id="directory-screen-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r=".72" fill="currentColor" />
        </pattern>
      </defs>
      <path d="M35 159 140 54h39L74 159z" fill="url(#directory-screen-dots)" opacity=".33" />
      <path d="M30 173h236" stroke="currentColor" opacity=".16" />
      <g className="directory-guides">
        <path d="M20 140v34h34M324 38h28v23M17 49h24M29 37v24M300 169h20m-10-10v20" />
        <path d="M40 161h130M203 49h105" strokeDasharray="3 5" />
      </g>
      {branches.map((path, index) => (
        <g className="press-branch" data-ink-branch={index + 1} key={path} style={{ animationDelay: `${index * 75}ms` }}>
          <path d={path} />
          <path d={`M344 ${67 + index * 23}h9`} />
          <circle cx="339" cy={67 + index * 23} r="3" />
        </g>
      ))}
    </svg>
  );
}

export function RegisterMark({ className }: { className?: string }) {
  return (
    <svg className={`register-mark ink-reveal ${className ?? ''}`} viewBox="0 0 108 44"
      fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true" data-ink-reveal>
      <circle cx="22" cy="22" r="11" />
      <path d="M3 22h38M22 3v38m25-19h56M54 15h37M54 29h23" />
      <path d="M104 16v12" />
    </svg>
  );
}
