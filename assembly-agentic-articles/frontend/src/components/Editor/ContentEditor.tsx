import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Redo,
  RotateCcw
} from 'lucide-react';
import RevisionModal from './RevisionModal';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatRelativeTime } from '../../utils/time';
import useContentStore from '../../store/contentStore';

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
  const navigate = useNavigate();
  const { reset } = useContentStore();
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

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
      setLastSaved(new Date());
    }
  }, [editor, content]);

  // Auto-save simulation (debounced)
  useEffect(() => {
    if (!editor) return;

    const handler = setTimeout(() => {
      // Simulate auto-save
      setLastSaved(new Date());
    }, 2000);

    return () => clearTimeout(handler);
  }, [editor?.getHTML()]);

  const handleRevisionSubmit = (feedback: string) => {
    onRevise(feedback);
    setRevisionModalOpen(false);
  };

  const handleStartOver = () => {
    reset();
    navigate('/create');
  };

  // Calculate word count
  const getWordCount = (): number => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = getWordCount();

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

            {/* Revision Counter Badge */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              revisionCount === 0
                ? 'bg-blue-500/10 text-blue-500'
                : revisionCount === 1
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : 'bg-orange-500/10 text-orange-500'
            }`}>
              {revisionCount === 0 && '✨ Original Draft'}
              {revisionCount === 1 && '🔄 Revision 1/2'}
              {revisionCount === 2 && '🔄 Revision 2/2 (Final)'}
            </div>

            {/* Word Count */}
            <div className="text-sm">
              <span className={`font-semibold ${
                wordCount >= 800 && wordCount <= 1000 ? 'text-success' : 'text-warning'
              }`}>
                {wordCount} words
              </span>
              <span className="text-text-secondary ml-2">
                {wordCount < 800 && `(${800 - wordCount} below target)`}
                {wordCount > 1000 && `(${wordCount - 1000} above target)`}
                {wordCount >= 800 && wordCount <= 1000 && '✓ Optimal length'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Start Over Button */}
            <button
              onClick={() => setConfirmResetOpen(true)}
              className="btn btn-outline btn-sm"
              title="Discard and start over"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>

            {/* Request Revision Button */}
            {revisionCount < 2 && (
              <button
                onClick={() => setRevisionModalOpen(true)}
                className="btn btn-secondary"
              >
                <RefreshCw className="w-4 h-4" />
                Request Revision {revisionCount < 2 && `(${2 - revisionCount} remaining)`}
              </button>
            )}

            {/* Approve Button */}
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

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="editor max-w-4xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Auto-Save Indicator */}
      <div className="border-t border-border p-4 bg-surface/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary flex items-center gap-2">
            💾 Last saved {formatRelativeTime(lastSaved)}
          </span>
          <span className="text-text-secondary">
            {wordCount} words • {editor ? `${editor.storage.characterCount?.characters() || 0} characters` : '0 characters'}
          </span>
        </div>
      </div>

      {/* Revision Modal */}
      <RevisionModal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        onSubmit={handleRevisionSubmit}
        loading={loading}
        currentRevision={revisionCount}
      />

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleStartOver}
        title="Start Over?"
        message="This will discard all progress including research and content. This cannot be undone."
        confirmText="Yes, Start Over"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
};

export default ContentEditor;