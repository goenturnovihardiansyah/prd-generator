export function Aurora({ subtle = false }: { subtle?: boolean }) {
  return (
    <div className={`aurora${subtle ? " aurora--subtle" : ""}`} aria-hidden="true">
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
      <div className="aurora__blob aurora__blob--4" />
      <div className="aurora__blob aurora__blob--3" />
      <div className="aurora__streaks" />
      {!subtle && (
        <svg className="aurora__waves" viewBox="0 0 1440 300" preserveAspectRatio="none">
          <path className="w1" d="M0 210 C 240 120, 480 120, 720 190 S 1200 270, 1440 170 L 1600 170" />
          <path className="w2" d="M0 240 C 260 170, 520 250, 760 210 S 1180 130, 1440 220 L 1600 220" />
          <path className="w3" d="M0 180 C 300 260, 560 150, 820 200 S 1240 250, 1440 150 L 1600 150" />
        </svg>
      )}
      <div className="aurora__grain" />
    </div>
  );
}
