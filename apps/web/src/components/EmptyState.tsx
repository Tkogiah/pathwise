export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-edge bg-surface-elevated p-8 text-center text-content-muted shadow-sm">
      <p className="text-lg font-medium">{message}</p>
      <p className="mt-2 text-base">
        Please check back later or contact support.
      </p>
    </div>
  );
}
