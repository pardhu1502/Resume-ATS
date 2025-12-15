function AnalysisResult({ result }) {
  if (!result) return null;

  const {
    score,
    matchedSkills = [],
    missingSkills = []
  } = result;

  return (
    <div className="result-card">
      <h2>ATS Analysis Result</h2>

      <div className="score">
        Score: <span>{score}%</span>
      </div>

      <div className="skills-grid">
        <div className="skills-box matched">
          <h3>Matched Skills</h3>
          <ul>
            {matchedSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="skills-box missing">
          <h3>Missing Skills</h3>
          <ul>
            {missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;
