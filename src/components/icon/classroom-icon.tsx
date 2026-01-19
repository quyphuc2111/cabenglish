export function ClassroomIcon({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="60" height="60" rx="8" fill="currentColor" fillOpacity="0.2"/>
      <path d="M15 20h30v25H15z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M20 30h20M20 35h15" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
