export function EmptyState({
  message,
  subtitle,
}: {
  message: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-edge bg-surface-elevated p-8 text-center text-content-muted shadow-sm">
      <p className="text-lg font-medium">{message}</p>
      {subtitle && <p className="mt-2 text-base">{subtitle}</p>}
    </div>
  );
}
