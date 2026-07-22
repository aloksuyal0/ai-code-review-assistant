export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md">
            🤖
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              AI Code Review
            </h1>

            <p className="text-xs text-slate-500">
              Smart AI Feedback
            </p>
          </div>
        </div>

        {/* Badge */}
        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          Powered by OpenRouter
        </span>
      </div>
    </header>
  );
}