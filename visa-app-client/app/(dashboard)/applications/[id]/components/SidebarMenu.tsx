import { ApplicationData } from "./types";
import { AlertCircle } from "lucide-react";

export const SidebarMenu = ({
  activeTab,
  setActiveTab,
  application,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  application: ApplicationData;
}) => {
  const hasPendingRequests = (type: string) => {
    return application.adminRequests?.some(r => r.type === type && r.status === 'PENDING');
  };

  return (
    <div className="w-full lg:w-[230px] shrink-0">
      {/* Menu Section */}
      <div className="bg-[#f2f2f2] text-[#00264d] text-[12px] font-bold py-1.5 px-2.5 border border-[#ddd] border-b-0">
        Menu
      </div>
      <div className="bg-white border border-[#ddd] mb-[15px] text-[12px]">
        {[
          { label: "Application home", id: "home" },
          { label: "Messages", id: "messages" },
          { label: "Update details", id: "update" },
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => setActiveTab(item.id)}
            className={`py-[7px] px-2.5 flex justify-between items-center cursor-pointer ${
              activeTab === item.id ? "bg-[#f4f7f9] text-[#2150a0] font-bold" : "bg-transparent text-[#333] font-normal"
            } ${i < 2 ? "border-b border-[#eee]" : ""}`}
          >
            <span>{item.label}</span>
            {item.id === 'home' && application.adminRequests?.some(r => r.status === 'PENDING') && (
               <AlertCircle size={12} className="text-[#cc3300]" />
            )}
          </div>
        ))}
      </div>

      {/* Actions Section */}
      <div className="bg-[#f2f2f2] text-[#00264d] text-[12px] font-bold py-1.5 px-2.5 border border-[#ddd] border-b-0">
        Actions
      </div>
      <div className="bg-white border border-[#ddd] text-[12px]">
        {[
          { label: "View attachments", id: "attachments", type: 'ATTACH_DOCUMENT' as const },
          ...(application.adminRequests?.some(r => r.type === 'BIOMETRIC')
            ? [{ label: "Biometrics collection", id: "biometrics", type: 'BIOMETRIC' as const }]
            : []),
          { label: "Health assessment", id: "health", type: 'HEALTH_ASSESSMENT' },
        ].map((item, i, arr) => (
          <div
            key={i}
            onClick={() => setActiveTab(item.id)}
            className={`py-[7px] px-2.5 flex justify-between items-center cursor-pointer hover:underline ${
              activeTab === item.id ? "bg-[#f4f7f9] text-[#2150a0] font-bold" : "bg-transparent text-[#333] font-normal"
            } ${i < arr.length - 1 ? "border-b border-[#eee]" : ""}`}
          >
            <strong>{item.label}</strong>
            {hasPendingRequests(item.type) && (
               <AlertCircle size={12} className="text-[#cc3300]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
