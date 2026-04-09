import { TProfile } from "@/types/user";
import { Bell, Check } from "lucide-react";

interface AlertPreferencesTabProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  profile: TProfile;
}

const alwaysOn = [
  "Change secret question and answer",
  "Account deleted",
  "Password reset request",
  "New browser login",
  "Email address verified",
];

export const AlertPreferencesTab = ({ onSubmit, profile }: AlertPreferencesTabProps) => {
  return (
    <div className="max-w-xl space-y-4">
      {/* Always-on alerts info */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Bell size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Always-on Alerts</h2>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-gray-500 mb-3">
            You will always receive email notifications for these security events:
          </p>
          <div className="space-y-2">
            {alwaysOn.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional alerts */}
      <form onSubmit={onSubmit}>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Optional Alerts</h2>
            <p className="text-xs text-gray-400 mt-0.5">Choose which extra notifications you want to receive</p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[
              { id: "alertPassword", label: "Password changed", desc: "Notify me when my password is updated" },
              { id: "alertUserDetails", label: "Profile details changed", desc: "Notify me when my account info is updated" },
            ].map(({ id, label, desc }) => (
              <label key={id} htmlFor={id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  id={id}
                  name={id}
                  defaultChecked={profile[id as keyof TProfile] as boolean ?? true}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
