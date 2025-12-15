const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage()
});

const STOPWORDS = new Set([
  "and", "with", "the", "for", "will", "work", "seeking",
  "candidate", "strong", "plus", "to", "of", "in", "on",
  "a", "an", "is", "are", "as", "at", "by", "from",
  "this", "that", "these", "those", "be", "have", "has",
  "experience", "skills", "requirements", "responsibilities"
]);

const SKILLS = new Set([
  // Languages
  "python", "java", "javascript", "c", "cpp",

  // ML / DS
  "machine", "learning", "data", "science",
  "scikit", "pandas", "numpy", "matplotlib", "seaborn",

  // Web
  "html", "css", "node", "react", "express",

  // Databases
  "mysql", "mongodb", "postgresql",

  // Tools
  "git", "github", "docker", "aws"
]);

const PHRASE_SKILLS = [
  "machine learning",
  "data science",
  "deep learning",
  "computer vision",
  "natural language processing"
];


function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text) {
  return [...new Set(
    text
      .split(" ")
      .filter(word =>
        SKILLS.has(word)
      )
  )];
}

function extractPhraseSkills(text) {
  return PHRASE_SKILLS.filter(skill =>
    text.includes(skill)
  );
}



app.post("/api/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    // console.log("REQ FILE:", req.file);
    // console.log("REQ BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    if (!req.body.jobDescription) {
      return res.status(400).json({ error: "Job description is required" });
    }

const dataBuffer = req.file.buffer;
const pdfData = await pdfParse(dataBuffer);

    const cleanedResumeText = cleanText(pdfData.text);
    const cleanedJD = cleanText(req.body.jobDescription);

    const phraseSkills = extractPhraseSkills(cleanedJD);
    const singleSkills = extractKeywords(cleanedJD);

    const phraseWords = phraseSkills.flatMap(skill => skill.split(" "));
    const filteredSingleSkills = singleSkills.filter(
      skill => !phraseWords.includes(skill)
    );

    const jdSkills = [...new Set([...phraseSkills, ...filteredSingleSkills])];

    const matchedSkills = jdSkills.filter(skill =>
      cleanedResumeText.includes(skill)
    );

    const missingSkills = jdSkills.filter(skill =>
      !cleanedResumeText.includes(skill)
    );

    const score =
      jdSkills.length === 0
        ? 0
        : Math.round((matchedSkills.length / jdSkills.length) * 100);

    res.json({
      score,
      matchedSkills,
      missingSkills
    });

  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
