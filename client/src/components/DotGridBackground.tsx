export function DotGridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dots with fade only at the bottom */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 80%, transparent 90%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 80%, transparent 90%)'
        }}
      >
        <div className="dot-grid-background" />
      </div>
    </div>
  );
}
