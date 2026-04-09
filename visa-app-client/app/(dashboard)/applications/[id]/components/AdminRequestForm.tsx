import React, { useState } from "react";
import { useAddAdminRequestMutation } from "@/redux/api/applicationApi";
import { toast } from "sonner";
import { Send, Loader2, AlertCircle, FileText, Fingerprint, Info, MapPin, Calendar, CheckSquare, Square } from "lucide-react";

interface AdminRequestFormProps {
  applicationId: string;
  onSuccess?: () => void;
}

export const AdminRequestForm = ({ applicationId, onSuccess }: AdminRequestFormProps) => {
  const [type, setType] = useState<'ATTACH_DOCUMENT' | 'BIOMETRIC' | 'INFORMATION'>('INFORMATION');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState('');
  
  // Biometric specific fields
  const [location, setLocation] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [requiredIdentifiers, setRequiredIdentifiers] = useState<string[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState('');

  const [addRequest, { isLoading }] = useAddAdminRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitMessage = message.trim() || (type === 'BIOMETRIC' ? 'Requirement to provide biometrics' : '');
    
    if (!submitMessage) {
      toast.error("Please enter a request message");
      return;
    }

    const payload = {
      id: applicationId,
      type,
      message: submitMessage,
      details,
      ...(type === 'BIOMETRIC' && {
        biometricDetails: {
          location,
          appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined,
          requiredIdentifiers,
          requiredDocuments: requiredDocuments.split(',').map(d => d.trim()).filter(d => d !== ''),
        }
      })
    };

    console.log("Sending admin request with payload:", payload);

    try {
      await addRequest(payload).unwrap();
      
      toast.success("Request sent to applicant successfully");
      setMessage('');
      setDetails('');
      setAppointmentDate('');
      // Keep defaults for biometric specific fields for next use
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to add request:", error);
      toast.error("Failed to send request. Check console for details.");
    }
  };

  return (
    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-sm p-4 mt-6 shadow-sm">
      <h3 className="text-[#00264d] font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-wide">
        <AlertCircle size={16} className="text-[#cc3300]" />
        Create Requirement Request
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1.5 tracking-tight">
            Request Purpose
          </label>
          <div className="flex gap-3">
             {[
               { id: 'ATTACH_DOCUMENT', label: 'Documents', icon: FileText },
               { id: 'BIOMETRIC', label: 'Biometrics', icon: Fingerprint },
               { id: 'INFORMATION', label: 'Information', icon: Info },
             ].map((btn) => (
               <button
                 key={btn.id}
                 type="button"
                 onClick={() => {
                   const newType = btn.id as 'ATTACH_DOCUMENT' | 'BIOMETRIC' | 'INFORMATION';
                   setType(newType);
                   if (newType === 'BIOMETRIC' && !message) {
                     setMessage('Requirement to provide biometrics');
                   }
                 }}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-[11px] font-bold border rounded-sm transition-all ${
                   type === btn.id 
                     ? 'bg-[#2150a0] text-white border-[#2150a0] shadow-md' 
                     : 'bg-white text-gray-600 border-gray-300 hover:border-[#2150a0] hover:text-[#2150a0]'
                 }`}
               >
                 <btn.icon size={14} />
                 {btn.label}
               </button>
             ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1.5 tracking-tight">
            Short Message
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Please upload your national ID card"
            className="w-full px-3 py-2 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#2150a0] shadow-inner"
          />
        </div>

        {type === 'BIOMETRIC' && (
          <div className="bg-white border border-[#e2e8f0] p-4 rounded-sm space-y-4 shadow-inner">
            <h4 className="text-[11px] font-bold text-[#2150a0] uppercase flex items-center gap-2 mb-2">
              <Fingerprint size={14} /> Biometric Configuration
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-tight">Collection Location</label>
                <div className="relative">
                  <MapPin size={12} className="absolute left-2.5 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter center name..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#2150a0]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-tight">Target Date (Optional)</label>
                <div className="relative">
                  <Calendar size={12} className="absolute left-2.5 top-2.5 text-gray-400" />
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#2150a0]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-tight">Required Identifiers</label>
              <div className="flex flex-wrap gap-3">
                {['Photograph', 'Fingerprints', 'Iris Scan', 'Signature'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (requiredIdentifiers.includes(item)) {
                        setRequiredIdentifiers(requiredIdentifiers.filter(i => i !== item));
                      } else {
                        setRequiredIdentifiers([...requiredIdentifiers, item]);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-bold transition-all border ${
                      requiredIdentifiers.includes(item)
                        ? 'bg-[#e8f1f8] text-[#2150a0] border-[#2150a0]'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    {requiredIdentifiers.includes(item) ? <CheckSquare size={12} /> : <Square size={12} />}
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-tight">Documents to Bring (Comma separated)</label>
              <div className="relative">
                <FileText size={12} className="absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={requiredDocuments}
                  onChange={(e) => setRequiredDocuments(e.target.value)}
                  placeholder="e.g. Passport, Appointment letter..."
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#2150a0]"
                />
              </div>
            </div>
          </div>
        )}

        <div>
           <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1.5 tracking-tight">
            Additional Instructions (Optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={2}
            placeholder="Provide specific instructions for the applicant..."
            className="w-full px-3 py-2 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#2150a0] shadow-inner resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#cc3300] hover:bg-[#b02c00] text-white py-2 px-4 rounded-sm text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
          SEND REQUEST TO APPLICANT
        </button>
      </form>
    </div>
  );
};
