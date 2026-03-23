import { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { ResumeDisplay } from './components/ResumeDisplay';
import { ShareButton } from './components/ShareButton';
import { loadResumeMarkdown, loadAbbreviatedResume } from './services/markdownParser';
import './App.css';

function App() {
  const [fullResumeContent, setFullResumeContent] = useState<string>('');
  const [abbreviatedContent, setAbbreviatedContent] = useState<string>('');

  useEffect(() => {
    // Load full resume for chatbot
    loadResumeMarkdown().then(setFullResumeContent);
    // Load abbreviated version for display
    loadAbbreviatedResume().then(setAbbreviatedContent);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">CareerChat</h1>
        <ShareButton />
      </header>

      <div className="content-wrapper">
        <ChatInterface resumeContent={fullResumeContent} />
        <ResumeDisplay content={abbreviatedContent} />
      </div>
    </div>
  );
}

export default App;
