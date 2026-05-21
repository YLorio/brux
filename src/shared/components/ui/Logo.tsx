import { cn } from '@shared/lib/cn';

/** Relación de aspecto real de public/logo.png (1280×413). */
const ASPECT = 1280 / 413;

export interface LogoProps {
  /** Altura del logo en px (el ancho se calcula con la relación de aspecto). */
  height?: number;
  /** Fuerza el logo en blanco, para fondos siempre oscuros (ej. panel de login). */
  onDark?: boolean;
  className?: string;
}

/**
 * Logo de marca (public/logo.png). El arte es negro + check verde sobre fondo
 * transparente; en superficies oscuras se invierte a blanco con un filtro.
 * Se fija ancho y alto explícitos para que nunca se deforme dentro de flex.
 */
export function Logo({ height = 28, onDark = false, className }: LogoProps) {
  const width = Math.round(height * ASPECT);
  return (
    <img
      src="/logo.png"
      alt="brux"
      width={width}
      height={height}
      style={{ width, height }}
      draggable={false}
      className={cn(
        'block shrink-0 select-none object-contain',
        onDark
          ? '[filter:brightness(0)_invert(1)]'
          : 'dark:[filter:brightness(0)_invert(1)]',
        className,
      )}
    />
  );
}
