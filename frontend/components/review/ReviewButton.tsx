type Props = {
  onClick: () => void;
};

export default function ReviewButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
    >
      Review Code
    </button>
  );
}