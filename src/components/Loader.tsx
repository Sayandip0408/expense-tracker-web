export default function Loader({ label }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[40vh] w-full flex-col items-center justify-center gap-3 text-forest/70">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest/20 border-t-forest" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  )
}
