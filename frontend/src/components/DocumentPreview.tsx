'use client';

import { DocumentType, DocumentFormData, DOCUMENT_NAMES, MutualNDAData, PilotData, CloudServiceData, DesignPartnerData, SLAData, ProfessionalServicesData, PartnershipData, SoftwareLicenseData, DPAData, BAAData, AIAddendumData } from '@/types/documents';
import { NDAPreview } from './NDAPreview';
import { PilotPreview } from './PilotPreview';
import { CloudServicePreview } from './CloudServicePreview';
import { GenericPreview } from './GenericPreview';

interface DocumentPreviewProps {
  documentType: DocumentType | null;
  formData: DocumentFormData;
}

export function DocumentPreview({ documentType, formData }: DocumentPreviewProps) {
  if (!documentType) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center px-6 py-10">
        <div className="w-20 h-20 mb-5 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-brand-blue/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-brand-navy font-semibold mb-2">Your document preview will appear here</p>
        <p className="text-sm text-brand-gray max-w-xs">
          Tell the AI assistant what agreement you need — NDA, pilot, cloud service, and more.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Mutual NDA', 'Pilot Agreement', 'Cloud Service'].map((label) => (
            <span key={label} className="badge-blue">{label}</span>
          ))}
        </div>
      </div>
    );
  }

  switch (documentType) {
    case DocumentType.MUTUAL_NDA:
      return (
        <div className="document-preview">
          <NDAPreview formData={formData as MutualNDAData} />
        </div>
      );

    case DocumentType.PILOT:
      return (
        <div className="document-preview">
          <PilotPreview formData={formData as PilotData} />
        </div>
      );

    case DocumentType.CLOUD_SERVICE:
      return (
        <div className="document-preview">
          <CloudServicePreview formData={formData as CloudServiceData} />
        </div>
      );

    case DocumentType.DESIGN_PARTNER:
    case DocumentType.SLA:
    case DocumentType.PROFESSIONAL_SERVICES:
    case DocumentType.PARTNERSHIP:
    case DocumentType.SOFTWARE_LICENSE:
    case DocumentType.DPA:
    case DocumentType.BAA:
    case DocumentType.AI_ADDENDUM:
      return (
        <div className="document-preview">
          <GenericPreview documentType={documentType} formData={formData} />
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-brand-gray">Preview not available for this document type</p>
        </div>
      );
  }
}
