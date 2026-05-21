import { Loader } from '@shared/components/feedback';

export function RouteFallback() {
  return (
    <div className="grid min-h-[60dvh] place-items-center px-4">
      <Loader label="Cargando…" />
    </div>
  );
}
