export const extractLatexCode = (content) => {
  if (!content) return '';
  const latexMatch = content.match(/```latex\n([\s\S]*?)```/);
  return latexMatch ? latexMatch[1].trim() : content;
};