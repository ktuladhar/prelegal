'use client';

import { useState, useEffect, useCallback } from 'react';
import { SavedDocument } from '@/types/auth';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES } from '@/types/documents';

interface DocumentsModalProps {
  onClose: () => void;
  onLoadDocument: (documentType: DocumentType, formData: DocumentFormData) => void;
}

export function DocumentsModal({ onClose, onLoadDocument }: DocumentsModalProps) {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await res.json();
      setDocuments(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);


  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setDeleting(id);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to delete document');
      }
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const handleLoad = (doc: SavedDocument) => {
    const docType = doc.document_type as DocumentType;
    onLoadDocument(docType, doc.form_data as unknown as DocumentFormData);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 modal-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-panel rounded-2xl max-w-3xl w-full shadow-2xl shadow-brand-navy/20 max-h-[80vh] flex flex-col animate-fade-up">
        <div className="flex justify-between items-center p-6 border-b border-border/70">
          <h2 className="text-2xl font-bold text-brand-navy">My Documents</h2>
          <button
            onClick={onClose}
            className="text-brand-gray hover:text-brand-navy text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-purple/20 border-t-brand-purple"></div>
            </div>
          ) : error ? (
            <div className="alert-error px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 text-brand-gray">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-purple/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-brand-purple/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-brand-navy">No saved documents yet</p>
              <p className="text-sm mt-1">Create and save your first document to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-surface-muted rounded-xl hover:bg-brand-blue/5 border border-border/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-brand-navy truncate">{doc.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="badge-purple">
                        {DOCUMENT_NAMES[doc.document_type as DocumentType] || doc.document_type}
                      </span>
                      <span className="text-xs text-brand-gray">
                        Updated {formatDate(doc.updated_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleLoad(doc)}
                      className="px-3 py-1.5 text-sm font-semibold text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleting === doc.id}
                      className="px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleting === doc.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
