type Props = {
  onClick: () => void;
  loading: boolean;
};

export default function ReviewButton({
  onClick,
  loading,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
        flex items-center justify-center gap-3
        rounded-xl
        bg-gradient-to-r from-blue-600 to-indigo-600
        px-8 py-4
        text-lg font-semibold text-white
        shadow-lg
        transition-all duration-300
        hover:scale-105
        hover:shadow-xl
        hover:from-blue-700
        hover:to-indigo-700
        disabled:cursor-not-allowed
        disabled:opacity-70
        disabled:hover:scale-100
      "
    >
      {loading ? (
        <>
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          <span>Reviewing Code...</span>
        </>
      ) : (
        <>
          <span>🤖</span>
          <span>Review Code</span>
        </>
      )}
    </button>
  );
}