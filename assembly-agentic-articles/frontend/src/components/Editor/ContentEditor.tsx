import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface ContentEditorProps {
  content: string | null;
  onApprove: () => void;
  onRevise: (feedback: string) => void;
  revisionCount: number;
  status: string;
  loading?: boolean;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onApprove,
  onRevise,
  revisionCount,
  status,
  loading = false
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Your content will appear here...',
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px]',
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const handleRevision = () => {
    if (feedback.trim()) {
      onRevise(feedback);
      setFeedback('');
      setShowFeedback(false);
    }
  };

  if (!content && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Content Yet</h3>
          <p className="text-text-secondary">
            Submit an idea to start generating content
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-text-primary font-medium">Generating content...</p>
          <p className="text-text-secondary text-sm mt-2">This may take 1-2 minutes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-secondary">
      {/* Toolbar */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-text-primary">Content Editor</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">
                Revision {revisionCount}/2
              </span>
              {revisionCount >= 2 && (
                <span className="text-xs text-orange-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Max revisions reached
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {revisionCount < 2 && (
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className="btn btn-ghost"
              >
                <RefreshCw className="w-4 h-4" />
                Request Revision
              </button>
            )}
            <button
              onClick={onApprove}
              className="btn btn-success"
              disabled={!content}
            >
              <CheckCircle className="w-4 h-4" />
              Approve & Format
            </button>
          </div>
        </div>

        {/* Editor Toolbar */}
        {editor && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-surface transition-colors ${
                editor.isActive('bold') ? 'bg-surface text-accent' : 'text-text-secondary'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-surface transition-colors ${
                editor.isActive('italic') ? 'bg-surface text-accent' : 'text-text-secondary'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-surface transition-colors ${
                editor.isActive('bulletList') ? 'bg-surface text-accent' : 'text-text-secondary'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-surface transition-colors ${
                editor.isActive('orderedList') ? 'bg-surface text-accent' : 'text-text-secondary'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-surface transition-colors ${
                editor.isActive('blockquote') ? 'bg-surface text-accent' : 'text-text-secondary'
              }`}
            >
              <Quote className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              className="p-2 rounded hover:bg-surface text-text-secondary transition-colors"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              className="p-2 rounded hover:bg-surface text-text-secondary transition-colors"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Feedback Panel */}
      {showFeedback && (
        <div className="border-b border-border p-4 bg-accent/5">
          <label className="block text-sm font-medium text-text-primary mb-2">
            What would you like to change?
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="E.g., 'Make it more technical' or 'Add more data about market trends'"
            className="textarea w-full mb-3"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowFeedback(false);
                setFeedback('');
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleRevision}
              disabled={!feedback.trim()}
              className="btn btn-primary"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="editor max-w-4xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Word Count */}
      <div className="border-t border-border p-4 bg-surface/30">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>
            {editor ? `${editor.storage.characterCount?.characters() || 0} characters` : '0 characters'}
          </span>
          <span>
            {editor ? `~${Math.round((editor.storage.characterCount?.characters() || 0) / 5)} words` : '0 words'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;