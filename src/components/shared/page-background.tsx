export function PageBackground() {
  return (
    <>
      {/* Grid pattern */}
      <div
        className="fixed inset-0 bg-grid-pattern opacity-10 dark:opacity-30 pointer-events-none z-0"
        aria-hidden="true"
      />
      {/* Light mode radial glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 dark:hidden"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(76,110,245,0.10) 0%, transparent 70%)',
        }}
      />
      {/* Dark mode radial glow (stronger) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 hidden dark:block"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(76,110,245,0.22) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
