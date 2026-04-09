import { useRouter } from "next/navigation";
import { TUser, TProfile } from "@/types/user";
import { User, Mail, MapPin, Lock, HelpCircle, Bell, Trash2, ArrowRight } from "lucide-react";

interface SummaryTabProps {
  user: TUser;
  profile: TProfile;
  setActiveTab: (tab: string) => void;
}

const InfoRow = ({
  label,
  value,
  onEdit,
  editLabel,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  editLabel?: string;
}) => (
  <div className="flex items-start sm:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-2">
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium truncate">{value || "Not set"}</p>
    </div>
    {onEdit && (
      <button
        onClick={onEdit}
        className="text-xs text-blue-600 hover:text-blue-800 shrink-0 font-medium hover:underline"
      >
        {editLabel || "Edit"}
      </button>
    )}
  </div>
);

export const SummaryTab = ({ user, profile, setActiveTab }: SummaryTabProps) => {
  const router = useRouter();

  const fullAddress = [
    profile?.streetAddress || profile?.businessAddress || profile?.address?.street,
    profile?.city || profile?.address?.city,
    profile?.stateProvince || profile?.state || profile?.address?.state,
    profile?.zipPostalCode || profile?.address?.zipCode,
    profile?.country || profile?.address?.country,
  ].filter(Boolean).join(", ") || "Not set";

  const givenName = user?.name?.split(" ")[0] || "—";
  const familyName = user?.name?.split(" ").slice(1).join(" ") || "—";

  return (
    <div className="space-y-4">
      {/* Account Info */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Personal Information</h2>
        </div>
        <div className="px-5">
          <InfoRow
            label="Given Name"
            value={givenName}
            onEdit={() => setActiveTab("Account details")}
            editLabel="Edit"
          />
          <InfoRow
            label="Family Name"
            value={familyName}
            onEdit={() => setActiveTab("Account details")}
            editLabel="Edit"
          />
          <InfoRow
            label="Username"
            value={user?.email || "—"}
          />
          {user?.role === "agent" && (
            <InfoRow
              label="Organisation"
              value={profile?.companyName || "Not set"}
              onEdit={() => setActiveTab("Account details")}
              editLabel="Edit"
            />
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Mail size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Contact & Address</h2>
        </div>
        <div className="px-5">
          <InfoRow
            label="Email Address"
            value={user?.email || "—"}
            onEdit={() => setActiveTab("Email address")}
            editLabel="Change"
          />
          <InfoRow
            label={user?.role === "agent" ? "Business Address" : "Street Address"}
            value={fullAddress}
            onEdit={() => setActiveTab("Account details")}
            editLabel="Edit"
          />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Lock size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Security Settings</h2>
        </div>
        <div className="px-5">
          <InfoRow
            label="Password"
            value="••••••••••••"
            onEdit={() => setActiveTab("Password")}
            editLabel="Change"
          />
          <InfoRow
            label="Secret Questions"
            value="Questions saved"
            onEdit={() => setActiveTab("Secret questions")}
            editLabel="Update"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Bell size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Notifications & Access</h2>
        </div>
        <div className="px-5">
          <InfoRow
            label="Alert Preferences"
            value="Email alerts enabled"
            onEdit={() => setActiveTab("Alert preferences")}
            editLabel="Manage"
          />
          <InfoRow
            label="Service Access"
            value="View your permitted services"
            onEdit={() => setActiveTab("Request access")}
            editLabel="Manage"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Go to Dashboard <ArrowRight size={15} />
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-lg transition-colors"
        >
          <Trash2 size={14} /> Delete Account
        </button>
      </div>
    </div>
  );
};
