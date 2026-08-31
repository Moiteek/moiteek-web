function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      {...props}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(15,23,42,0.72)] p-5 shadow-[0_10px_30px_rgba(2,6,23,0.7)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_0_1px_rgba(0,242,254,0.25),0_0_30px_rgba(0,242,254,0.16)] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,242,254,0.12),transparent_45%)] opacity-80" />
      <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default GlassCard
