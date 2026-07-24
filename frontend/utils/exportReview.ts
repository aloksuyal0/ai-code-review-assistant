export function exportReview(
  language: string,
  code: string,
  review: string,
  reviewTime: number | null
) {
  const content = `# AI Code Review

## Language
${language}

## Review Time
${reviewTime ?? "N/A"} seconds

## Source Code

\`\`\`${language}
${code}
\`\`\`

## AI Review

${review}
`;

  const blob = new Blob([content], {
    type: "text/markdown;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `review-${Date.now()}.md`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}