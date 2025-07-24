"use client";
import React, { useState, ClipboardEvent, useMemo } from 'react';
import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL } from 'diff-match-patch';

type HumanizationMode = 'subtle' | 'balanced' | 'strong' | 'stealth';
type FeedbackStatus = 'none' | 'liked' | 'disliked';

const SkeletonLoader = () => (
  <div className="placeholder-glow">
    <span className="placeholder col-7"></span>
    <span className="placeholder col-4"></span>
    <span className="placeholder col-4"></span>
    <span className="placeholder col-6"></span>
    <span className="placeholder col-8"></span>
  </div>
);

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [diffHtml, setDiffHtml] = useState('');
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mode, setMode] = useState<HumanizationMode>('balanced');
  const [feedback, setFeedback] = useState<FeedbackStatus>('none');

  const createDiffHtml = (text1: string, text2: string) => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diff);
    
    return diff.map(([op, data]) => {
      const style = op === DIFF_INSERT ? 'diff-insert' : op === DIFF_DELETE ? 'diff-delete' : '';
      return `<span class="${style}">${data}</span>`;
    }).join('');
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) return;

    setIsHumanizing(true);
    setOutputText('');
    setDiffHtml('');
    setFeedback('none');
    
    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, mode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to humanize text');
      }

      const data = await response.json();
      setOutputText(data.humanizedText);
      setDiffHtml(createDiffHtml(inputText, data.humanizedText));
    } catch (error) {
      console.error('Humanization error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setOutputText(`Sorry, something went wrong: ${errorMessage}`);
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text');
    setInputText(text);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setDiffHtml('');
    setFeedback('none');
  };

  const handleFeedback = (newFeedback: FeedbackStatus) => {
    setFeedback(current => (current === newFeedback ? 'none' : newFeedback));
    // In a real app, you would send this feedback to your backend for logging.
    console.log(`Feedback received: ${newFeedback}`);
  };

  const inputWordCount = useMemo(() => (inputText.trim() ? inputText.trim().split(/\s+/).length : 0), [inputText]);
  const outputWordCount = useMemo(() => (outputText.trim() ? outputText.trim().split(/\s+/).length : 0), [outputText]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-bounding-box me-2" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5"/>
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            </svg>
            AI Humanizer
          </a>
        </div>
      </nav>

      <main className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card bg-light border-primary shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">AI Text</h5>
                <p className="card-text text-muted">Paste the text you want to humanize.</p>
                <textarea
                  className="form-control"
                  rows={12}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Enter AI-generated text here..."
                ></textarea>
                <div className="d-flex justify-content-between mt-2 text-muted">
                  <span>{inputWordCount} words</span>
                  <span>{inputText.length} characters</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-light border-success shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-success">Humanized Text</h5>
                <p className="card-text text-muted">Your human-like text will appear here.</p>
                <div
                  className="form-control"
                  style={{ height: '280px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
                >
                  {isHumanizing ? <SkeletonLoader /> : <div dangerouslySetInnerHTML={{ __html: diffHtml || outputText }} />}
                </div>
                <div className="d-flex justify-content-between mt-2 text-muted">
                  <div>
                    <span>{outputWordCount} words</span>
                    <span className="ms-3">{outputText.length} characters</span>
                  </div>
                  {outputText && !isHumanizing && (
                    <div>
                      <button className={`btn btn-sm ${feedback === 'liked' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => handleFeedback('liked')}>👍</button>
                      <button className={`btn btn-sm ${feedback === 'disliked' ? 'btn-danger' : 'btn-outline-danger'} ms-2`} onClick={() => handleFeedback('disliked')}>👎</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 d-flex justify-content-center align-items-center">
          <div className="me-3">
            <select 
              className="form-select form-select-lg"
              value={mode}
              onChange={(e) => setMode(e.target.value as HumanizationMode)}
            >
              <option value="subtle">Subtle</option>
              <option value="balanced">Balanced</option>
              <option value="strong">Strong</option>
              <option value="stealth">Stealth</option>
            </select>
          </div>
          <button 
            className="btn btn-primary btn-lg" 
            onClick={handleHumanize}
            disabled={isHumanizing || !inputText.trim()}
          >
            {isHumanizing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Humanizing...
              </>
            ) : 'Humanize Text'}
          </button>
        </div>
        <div className="text-center mt-3">
          <button 
            className="btn btn-secondary me-2" 
            onClick={handleCopy}
            disabled={!outputText}
          >
            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleClear}
            disabled={!inputText && !outputText}
          >
            Clear Text
          </button>
        </div>
      </main>

      <footer className="text-center mt-5 mb-3">
        <p className="text-muted">Built with Next.js and Bootstrap</p>
      </footer>
    </div>
  );
}
