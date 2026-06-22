'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { DocumentPreview } from '@/components/DocumentPreview';
import { DocumentDownload } from '@/components/DocumentDownload';
import { AuthModal } from '@/components/AuthModal';
import { UserMenu } from '@/components/UserMenu';
import { DocumentsModal } from '@/components/DocumentsModal';
import { SaveDocumentButton } from '@/components/SaveDocumentButton';
import { BrandLogo } from '@/components/BrandLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentType, DocumentFormData, DOCUMENT_NAMES, getDefaultFormData } from '@/types/documents';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [formData, setFormData] = useState<DocumentFormData>(getDefaultFormData(DocumentType.MUTUAL_NDA));
  const [isComplete, setIsComplete] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const handleDocumentTypeDetected = (type: DocumentType) => {
    setDocumentType(type);
    setFormData(getDefaultFormData(type));
  };

  const handleFieldsExtracted = (fields: Partial<DocumentFormData>) => {
    setFormData(prev => {
      const { party1: newParty1, party2: newParty2, ...scalarFields } = fields;

      return {
        ...prev,
        ...scalarFields,
        party1: newParty1 ? mergeParty(prev.party1, newParty1) : prev.party1,
        party2: newParty2 ? mergeParty(prev.party2, newParty2) : prev.party2,
      } as DocumentFormData;
    });
  };

  function mergeParty(existing: DocumentFormData['party1'], updates: DocumentFormData['party1']) {
    return {
      name: updates.name !== '' ? updates.name : existing.name,
      title: updates.title !== '' ? updates.title : existing.title,
      company: updates.company !== '' ? updates.company : existing.company,
      noticeAddress: updates.noticeAddress !== '' ? updates.noticeAddress : existing.noticeAddress,
      date: updates.date !== '' ? updates.date : existing.date,
    };
  }

  const handleLoadDocument = useCallback((type: DocumentType, data: DocumentFormData) => {
    setDocumentType(type);
    setFormData(data);
    setIsComplete(true);
    setChatKey((k) => k + 1);
  }, []);

  const handleNewDocument = useCallback(() => {
    setDocumentType(null);
    setFormData(getDefaultFormData(DocumentType.MUTUAL_NDA));
    setIsComplete(false);
    setChatKey((k) => k + 1);
  }, []);

  const pageTitle = documentType
    ? `${DOCUMENT_NAMES[documentType]} Creator`
    : 'Legal Document Creator';

  const pageSubtitle = documentType
    ? `Create a professional ${DOCUMENT_NAMES[documentType]} with AI assistance`
    : 'Create professional legal documents with AI assistance';

  if (authLoading) {
    return (
      <div className="min-h-screen app-shell flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 animate-fade-up">
          <BrandLogo size={52} />
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-purple/20 border-t-brand-purple" />
          <p className="text-sm text-brand-gray">Loading Prelegal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell">
      <header className="sticky top-0 z-20 app-header shadow-sm shadow-brand-navy/5">
        <div className="max-w-[1800px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0">
            <BrandLogo size={44} />
            <div className="hidden md:block h-10 w-px bg-border" />
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-lg font-bold text-brand-navy truncate">{pageTitle}</h1>
              <p className="text-sm text-brand-gray truncate">{pageSubtitle}</p>
            </div>
            {documentType && (
              <span className="badge-purple shrink-0 hidden lg:inline-flex">
                {DOCUMENT_NAMES[documentType]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            {isComplete && documentType && (
              <>
                {user && <SaveDocumentButton documentType={documentType} formData={formData} />}
                <DocumentDownload documentType={documentType} formData={formData} />
              </>
            )}
            {documentType && (
              <button onClick={handleNewDocument} className="btn-ghost hidden sm:inline-flex">
                New Document
              </button>
            )}
            {user ? (
              <UserMenu user={user} onOpenDocuments={() => setShowDocumentsModal(true)} />
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="btn-primary">
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="sm:hidden px-4 pt-3 pb-1">
        <h1 className="text-base font-bold text-brand-navy truncate">{pageTitle}</h1>
        <p className="text-xs text-brand-gray truncate">{pageSubtitle}</p>
      </div>

      <main className="max-w-[1800px] mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 animate-fade-up">
          <section className="panel-card overflow-hidden">
            <div className="panel-header">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-brand-navy">AI Assistant</h2>
                  <p className="text-sm text-brand-gray">
                    {documentType
                      ? `Creating your ${DOCUMENT_NAMES[documentType]}`
                      : 'Tell me what document you need'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6 h-[calc(100vh-220px)]">
              <ChatInterface
                key={chatKey}
                formData={formData}
                onDocumentTypeDetected={handleDocumentTypeDetected}
                onFieldsExtracted={handleFieldsExtracted}
                onComplete={() => setIsComplete(true)}
              />
            </div>
          </section>

          <section className="panel-card overflow-hidden">
            <div className="panel-header flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-brand-navy">Document Preview</h2>
                  <p className="text-sm text-brand-gray">Live preview updates as you chat</p>
                </div>
              </div>
              {isComplete && <span className="badge-green shrink-0">Ready to download</span>}
            </div>
            <div className="p-5 sm:p-6 max-h-[calc(100vh-220px)] overflow-y-auto">
              <DocumentPreview documentType={documentType} formData={formData} />
            </div>
          </section>
        </div>
      </main>

      <footer className="app-footer mt-4">
        <div className="max-w-[1800px] mx-auto px-6 py-4 text-center text-sm text-brand-gray">
          Based on{' '}
          <a
            href="https://commonpaper.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:underline font-medium"
          >
            Common Paper
          </a>{' '}
          Standard Terms, licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:underline font-medium"
          >
            CC BY 4.0
          </a>
        </div>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showDocumentsModal && (
        <DocumentsModal
          onClose={() => setShowDocumentsModal(false)}
          onLoadDocument={handleLoadDocument}
        />
      )}
    </div>
  );
}
