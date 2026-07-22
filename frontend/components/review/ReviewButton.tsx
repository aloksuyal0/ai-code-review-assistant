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
      className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {loading ? "Reviewing..." : "Review Code"}
    </button>
  );
}