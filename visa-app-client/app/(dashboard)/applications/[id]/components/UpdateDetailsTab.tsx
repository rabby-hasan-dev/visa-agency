import React from "react";
import { UpdateForm } from "./UpdateForm";
import { ApplicationData } from "./types";
import { MapPin, Phone, Mail, BookOpen, ChevronRight } from "lucide-react";

interface UpdateDetailsTabProps {
  activeUpdateForm: string | null;
  setActiveUpdateForm: (type: string | null) => void;
  application: ApplicationData;
  id: string;
}

const UPDATE_OPTIONS = [
  {
    id: "address",
    label: "Change of Address",
    description: "Update your residential or business address",
    icon: MapPin,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "contact",
    label: "Contact Phone Numbers",
    description: "Update your mobile, home, or business phone number",
    icon: Phone,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "email",
    label: "Email Address",
    description: "Update the email used for application communications",
    icon: Mail,
    color: "text-purple-600 bg-purple-50",
  },
  {
    id: "passport",
    label: "Passport Details",
    description: "Update passport or travel document information",
    icon: BookOpen,
    color: "text-amber-600 bg-amber-50",
  },
];

export const UpdateDetailsTab = ({
  activeUpdateForm,
  setActiveUpdateForm,
  application,
  id,
}: UpdateDetailsTabProps) => {
  return (
    <div className="text-gray-800">
      {!activeUpdateForm ? (
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h2 className="text-base font-semibold text-gray-900">Update Details</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Select a section below to provide updated information for this application.
            </p>
          </div>

          {/* Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UPDATE_OPTIONS.map(({ id: optId, label, description, icon: Icon, color }) => (
              <button
                key={optId}
                onClick={() => setActiveUpdateForm(optId)}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <UpdateForm
          type={activeUpdateForm}
          onCancel={() => setActiveUpdateForm(null)}
          application={application}
          trn={id.slice(-10).toUpperCase()}
          applicationId={id}
        />
      )}
    </div>
  );
};
