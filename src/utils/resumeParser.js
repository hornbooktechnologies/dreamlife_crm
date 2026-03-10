import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';

// Set worker source for PDF.js to a stable CDN version matching the installed package (3.11.174)
// We use cdnjs which is reliable.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

/**
 * Basic Regex patterns for extraction
 */
const PATTERNS = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    phone: /(?:\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/,
    linkedin: /linkedin\.com\/in\/[a-zA-Z0-9_-]+/,
    github: /github\.com\/[a-zA-Z0-9_-]+/,
};

/**
 * Extracts text from a file (PDF or DOCX)
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const extractTextFromFile = async (file) => {
    const fileType = file.type;

    if (fileType === 'application/pdf') {
        return extractPdfText(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return extractDocxText(file);
    } else {
        throw new Error('Unsupported file type. Please upload PDF or DOCX.');
    }
};

const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' '); // Join with space to keep natural flow
        fullText += pageText + '\n';
    }

    return fullText;
};

const extractDocxText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

/**
 * Parses unstructured resume text into our form data structure.
 * @param {string} text 
 * @returns {Object} Partial formData
 */
export const parseResumeText = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const result = {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        summary: '',
        experience: [], // Difficult to parse reliably without ML
        projects: [],
        education: [],
        skills: []
    };

    if (lines.length > 0) {
        result.name = lines[0].replace(/[^a-zA-Z\s]/g, '').trim(); // Remove noise
    }

    const emailMatch = text.match(PATTERNS.email);
    if (emailMatch) result.email = emailMatch[0];

    const phoneMatch = text.match(PATTERNS.phone);
    if (phoneMatch) result.phone = phoneMatch[0];

    const linkedinMatch = text.match(PATTERNS.linkedin);
    if (linkedinMatch) result.linkedin = "https://" + linkedinMatch[0];

    const githubMatch = text.match(PATTERNS.github);
    if (githubMatch) result.github = "https://" + githubMatch[0];

    // Try to find sections
    const lowerText = text.toLowerCase();

    // HEURISTIC: "Experience" section
    const expStart = lowerText.indexOf('experience');
    const projStart = lowerText.indexOf('projects');
    const eduStart = lowerText.indexOf('education');
    const skillsStart = lowerText.indexOf('skills');

    // If we have sections, we can try to extract content between them
    // This is very rudimentary.

    if (skillsStart !== -1) {
        // Extract skills roughly
        const end = Math.min(
            expStart > skillsStart ? expStart : Infinity,
            projStart > skillsStart ? projStart : Infinity,
            eduStart > skillsStart ? eduStart : Infinity
        );
        const skillText = text.substring(skillsStart, end === Infinity ? text.length : end);
        // Clean up "Skills" header
        const cleanSkills = skillText.replace(/skills?/i, '').replace(/[:|-]/g, '').trim();
        result.skills = cleanSkills.split(/[,•\n]/).map(s => s.trim()).filter(s => s.length > 2);
    }

    return result;
};

// Heuristic for headers
const isSectionHeader = (line) => {
    const l = line.toLowerCase();
    return (l.includes('experience') || l.includes('education') || l.includes('project') || l.includes('skill')) && l.length < 30;
};
