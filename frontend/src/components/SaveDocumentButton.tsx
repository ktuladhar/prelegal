'use client';

import { useState, useEffect } from 'react';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';

interface SaveDocumentButtonProps {
  documentType: DocumentType;
  formData: DocumentFormData;
  onSaved?: () => void;
}

export function SaveDocumentButton({ documentType, formData, onSaved }: SaveDocumentButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!showModal) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  const handleOpenModal = () => {
    const defaultTitle = `${DOCUMENT_NAMES[documentType]} - ${new Date().toLocaleDateString()}`;
    setTitle(defaultTitle);
    setError('');
    setSuccess(false);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          document_type: documentType,
          title: title.trim(),
          form_data: formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to save document');
      }

      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        onSaved?.();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="btn-secondary flex items-center gap-2 py-2.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Save
      </button>

      {showModal && (
        <div className="fixed inset-0 modal-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="modal-panel rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-brand-navy/20 animate-fade-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-navy">Save Document</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-brand-gray hover:text-brand-navy text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-brand-navy">Document saved!</p>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-brand-navy mb-1.5">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="input-field"
                    placeholder="Enter a title for your document"
                  />
                </div>

                <div className="mb-4 p-3 bg-surface-muted rounded-xl border border-border/70">
                  <p className="text-sm text-brand-gray">
                    <span className="font-medium">Type:</span>{' '}
                    {DOCUMENT_NAMES[documentType]}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 alert-error px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-ghost border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !title.trim()}
                    className="flex-1 btn-primary"
                  >
                    {saving ? 'Saving...' : 'Save Document'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
