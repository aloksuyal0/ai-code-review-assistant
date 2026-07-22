type Review = {
  score: number;
  bugs: string[];
  performance: string;
  security: string;
  suggestions: string[];
};

type Props = {
  review: Review | null;
};

export default function ReviewCard({ review }: Props) {
  if (!review) return null;

  return (
    <div className="mt-6 rounded-lg border bg-white p-6">
      <h2 className="text-2xl font-bold">Review Result</h2>

      <p>
        <strong>Score:</strong> {review.score}/100
      </p>

      <p>
        <strong>Performance:</strong> {review.performance}
      </p>

      <p>
        <strong>Security:</strong> {review.security}
      </p>

      <h3 className="mt-4 font-semibold">Suggestions</h3>

      <ul className="list-disc pl-6">
        {review.suggestions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}