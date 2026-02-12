export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
      <p className="text-lg font-medium">{message}</p>
      <p className="mt-2 text-sm">
        Please check back later or contact support.
      </p>
    </div>
  );
}
