// Load full resume for chatbot
export async function loadResumeMarkdown(): Promise<string> {
  try {
    const response = await fetch('/career-chat/src/data/resume.md');
    return await response.text();
  } catch (error) {
    console.error('Failed to load resume:', error);
    return '# Resume content unavailable';
  }
}

// Load abbreviated resume for display
export async function loadAbbreviatedResume(): Promise<string> {
  try {
    const response = await fetch('/career-chat/src/data/resume-abbreviated.md');
    return await response.text();
  } catch (error) {
    console.error('Failed to load abbreviated resume:', error);
    return '# Resume content unavailable';
  }
}
