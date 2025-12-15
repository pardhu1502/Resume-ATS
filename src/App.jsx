import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import JobDescription from "./components/JobDescription";
import AnalyzeButton from "./components/AnalyzeButton";
import AnalysisResult from "./components/AnalysisResult";
import { analyzeATS } from "./utils/atsAnalyzer";


function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

async function handleAnalyze() {
  if (!resumeFile || !jobDescription) return;

  setLoading(true);

  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription);

  try {
    const response = await fetch("http://localhost:5000/api/analyze-resume", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setAnalysisResult(data);
  } catch (error) {
    console.error("Analysis failed", error);
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="app-container">
      <h1>ATS Resume Analyzer</h1>
      <ResumeUpload onFileSelect={setResumeFile} />
      <JobDescription value={jobDescription} onChange={setJobDescription} />
      <AnalyzeButton onAnalyze={handleAnalyze} disabled={!resumeFile || !jobDescription} loading={loading} />
      <div className="result-card">
      <AnalysisResult result={analysisResult} />
      </div>

    </div>
  );
}

export default App;
