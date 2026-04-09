import { TAccessRequest } from "@/types/accessRequest";
import { TUser, TProfile } from "@/types/user";
import { Loader2, Trash2, CheckCircle2, Clock } from "lucide-react";

interface RequestAccessTabProps {
  user: TUser;
  profile: TProfile;
  myRequests: TAccessRequest[];
  selectedServices: string[];
  handleServiceToggle: (service: string) => void;
  onAccessRequestSubmit: () => Promise<void>;
  handleRemoveRequest: (id: string) => Promise<void>;
  isCreatingRequest: boolean;
}

const SERVICES = [
  "Online Lodgement (Apply for a visa or citizenship including sponsorship and nomination)",
  "Organisation Account Administration",
  "Visa Entitlement Verification Online (VEVO) for organisations",
];

export const RequestAccessTab = ({
  user,
  profile,
  myRequests,
  selectedServices,
  handleServiceToggle,
  onAccessRequestSubmit,
  handleRemoveRequest,
  isCreatingRequest,
}: RequestAccessTabProps) => {
  return (
    <div className="space-y-4">
      {/* Current Requests */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Your Access Requests</h2>
          <p className="text-xs text-gray-400 mt-0.5">Submitted requests and their current status</p>
        </div>

        {myRequests.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {myRequests.map((req: TAccessRequest) => (
              <div key={req._id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{req.serviceName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Requested {new Date(req.requestDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {req.status === "approved" ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={12} /> Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                  {req.status !== "approved" && (
                    <button
                      onClick={() => handleRemoveRequest(req._id)}
                      className="text-gray-400 hover:text-rose-500 transition-colors"
                      title="Remove request"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            No access requests yet
          </div>
        )}
      </div>

      {/* Request New Services */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Request Additional Services</h2>
          <p className="text-xs text-gray-400 mt-0.5">Select the services you need access to</p>
        </div>

        <div className="px-5 py-4 space-y-2">
          {SERVICES.map((service) => (
            <label
              key={service}
              htmlFor={service}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                id={service}
                checked={selectedServices.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{service}</span>
            </label>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onAccessRequestSubmit}
            disabled={isCreatingRequest || selectedServices.length === 0}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingRequest ? <Loader2 size={14} className="animate-spin" /> : null}
            {isCreatingRequest ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};
