export default function SectionDivider({ label }) {
  if (label) {
    return (
      <div className="flex items-center gap-4 my-10">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-2">
          {label}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    )
  }
  return (
    <div className="flex items-center gap-3 my-10">
      <div className="w-8 h-1 bg-red-600 rounded-full" />
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}
