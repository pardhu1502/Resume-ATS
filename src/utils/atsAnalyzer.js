const STOP_WORDS = new Set([
  "the", "and", "a", "to", "of", "in", "for", "with",
  "on", "at", "by", "from", "is", "are", "was", "were",
  "be", "this", "that", "it", "as", "an", "or"
]);

export function analyzeATS(resumeText, jobDescription) {
const jdWords = jobDescription
  .toLowerCase()
  .split(/\W+/)
  .filter(word => word.length > 2 && !STOP_WORDS.has(word));
  const resumeWords = resumeText.toLowerCase().split(/\W+/);

  const jdSet = new Set(jdWords);
  const resumeSet = new Set(resumeWords);

  const matchedSkills = [...jdSet].filter(word =>
    resumeSet.has(word) && word.length > 2
  );

  const missingSkills = [...jdSet].filter(word =>
    !resumeSet.has(word) && word.length > 2
  );

  const score = Math.round(
    (matchedSkills.length / jdSet.size) * 100
  );

  return { score, matchedSkills, missingSkills };
}
