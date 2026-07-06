"use client";

import React, { useState } from "react";
import { Search, Filter, CheckCircle, Clock, Upload, X, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Candidate = {
  id: string;
  firstName: string;
  surname: string;
  jobAppliedFor: string;
  countryAppliedFor: string;
  status: string;
  createdAt: string;
};

export default function AdminDashboard({ initialCandidates }: { initialCandidates: Candidate[] }) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadCandidate, setUploadCandidate] = useState<Candidate | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // --- 1. FIT FOR APPLY LOGIC ---
  const handleUpdateStatus = async (candidateId: string, newStatus: string) => {
    setLoadingId(candidateId);
    
    try {
      const response = await fetch('/api/application/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setCandidates(prev => 
        prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c)
      );

      toast.success("Candidate marked as Fit for Apply!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingId(null);
    }
  };

  // --- 2. UPLOAD MODAL LOGIC ---
  const openUploadModal = (candidate: Candidate) => {
    setUploadCandidate(candidate);
    setDocumentName("");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadCandidate || !selectedFile || !documentName) {
      toast.error("Please fill all fields and select a file.");
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading(`Encrypting & Uploading...`);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("candidateId", uploadCandidate.id);
      formData.append("documentName", documentName);

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData, // Do not set Content-Type, fetch handles multipart boundaries automatically
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success(data.message, { id: loadingToast });
      setIsModalOpen(false);

    } catch (error: any) {
      toast.error(error.message, { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    `${c.firstName} ${c.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.jobAppliedFor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-10 px-6 md:px-10 max-w-7xl mx-auto font-sans relative">
      <Toaster position="top-right" />
      
      {/* Upload Document Modal */}
      {isModalOpen && uploadCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Secure Document Upload</h3>
                <p className="text-xs text-slate-500">For {uploadCandidate.firstName} {uploadCandidate.surname}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFileUpload} className="p-6 space-y-6">
              <div className="bg-blue-50/50 border border-blue-100 text-blue-800 text-sm p-4 rounded-xl">
                <strong>Auto-Encryption Active:</strong> The uploaded PDF will be securely encrypted. The candidate will need their unique password (Name + DOB) to open it.
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Document Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Offer Letter - Dubai" 
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select PDF File</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    required
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload size={32} className="text-blue-500 mb-2" />
                  {selectedFile ? (
                    <p className="text-sm font-bold text-slate-800">{selectedFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500">PDF documents only</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isUploading || !selectedFile} className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-70 transition-colors flex justify-center items-center gap-2">
                  {isUploading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={18} />}
                  Encrypt & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage applications and process candidates.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates by name or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        {/* Interactive Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="p-6 font-bold">Candidate</th>
                <th className="p-6 font-bold">Role & Destination</th>
                <th className="p-6 font-bold">Applied Date</th>
                <th className="p-6 font-bold">Status</th>
                <th className="p-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {candidate.firstName.charAt(0)}{candidate.surname.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{candidate.firstName} {candidate.surname}</p>
                        <p className="text-xs text-slate-500">ID: {candidate.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-semibold text-slate-700">{candidate.jobAppliedFor}</p>
                    <p className="text-xs text-slate-500">{candidate.countryAppliedFor}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-medium text-slate-600">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      candidate.status === 'FIT_FOR_APPLY_PENDING' 
                        ? 'bg-amber-100 text-amber-700'
                        : candidate.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {candidate.status === 'FIT_FOR_APPLY_PENDING' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                      {candidate.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Upload Document Button */}
                      <button 
                        onClick={() => openUploadModal(candidate)}
                        title="Upload Offer Letter"
                        className="p-2.5 text-slate-400 bg-slate-50 border border-slate-200 rounded-lg hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all"
                      >
                        <Upload size={18} />
                      </button>

                      {/* Fit for Apply Button */}
                      {candidate.status !== 'FIT_FOR_APPLY_PENDING' ? (
                        <button 
                          onClick={() => handleUpdateStatus(candidate.id, 'FIT_FOR_APPLY_PENDING')}
                          disabled={loadingId === candidate.id}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-70 transition-all"
                        >
                          {loadingId === candidate.id ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                          Fit for Apply
                        </button>
                      ) : (
                        <div className="w-[124px]" /> // Placeholder to keep spacing aligned
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    No candidates found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
