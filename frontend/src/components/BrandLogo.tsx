import Image from 'next/image';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function BrandLogo({ size = 40, showWordmark = true, className = '' }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Prelegal logo"
        width={size}
        height={size}
        priority
        className="shrink-0"
      />
      {showWordmark && (
        <div className="leading-tight">
          <span className="block text-lg font-bold tracking-tight text-brand-navy">Prelegal</span>
          <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-brand-gray">
            Legal AI
          </span>
        </div>
      )}
    </div>
  );
}
