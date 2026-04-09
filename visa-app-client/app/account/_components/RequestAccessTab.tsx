import { TAccessRequest } from "@/types/accessRequest";
import { TUser, TProfile } from "@/types/user";

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
    <div className="bg-white border border-gray-300 shadow-sm min-h-[500px] flex flex-col">
      <div className="bg-[#1b3564] text-white font-bold text-[13px] px-3 py-1.5">
        Request access
      </div>
      <div className="p-5 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-y-2 sm:gap-y-1 text-[13px] mb-6">
          <div className="font-bold">Name</div>
          <div>{user?.name || "rahman syed"}</div>

          <div className="font-bold">Username</div>
          <div>{user?.email || "ghave763@gmail.com"}</div>
        </div>

        <h3 className="text-[#1b3564] text-[18px] font-normal mb-2 mt-0">
          Requested services
        </h3>
        <div className="overflow-x-auto mb-8 border border-[#cccccc]">
          <table className="w-full text-left text-[12px] border-collapse bg-[#eeeeee]">
            <thead>
              <tr className="bg-[#666666] text-white">
                <th className="p-2 font-bold whitespace-nowrap">
                  Request date
                </th>
                <th className="p-2 font-bold">Organisation registered name</th>
                <th className="p-2 font-bold">Service</th>
                <th className="p-2 font-bold">Request status</th>
                <th className="p-2 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.length > 0 ? (
                myRequests.map((req: TAccessRequest) => (
                  <tr
                    key={req._id}
                    className="bg-white border-b border-gray-200"
                  >
                    <td className="p-2 whitespace-nowrap">
                      {new Date(req.requestDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-2">
                      {req.organisationRegisteredName || "-"}
                    </td>
                    <td className="p-2">{req.serviceName}</td>
                    <td className="p-2 capitalize">
                      {req.status === "approved"
                        ? `Added on ${new Date(
                            req.updatedAt,
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}`
                        : req.status}
                    </td>
                    <td className="p-2 text-center text-[#1b3564]">
                      {req.status !== "approved" && (
                        <button
                          onClick={() => handleRemoveRequest(req._id)}
                          className="underline hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                      {req.status === "approved" && "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white">
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No access requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="text-[#1b3564] text-[18px] font-normal mb-2 mt-0">
          Request additional services
        </h3>
        <p className="mb-4 text-[13px] text-black">
          Fields marked <span className="text-[#c41a1f]">*</span> must be
          completed.
        </p>

        <div className="flex flex-col sm:flex-row mb-4">
          <div className="w-full sm:w-[300px] text-[13px] font-sans mb-2 sm:mb-0">
            What type of organisation online services do you need?{" "}
            <span className="text-[#c41a1f]">*</span>
          </div>
          <div className="flex-1 space-y-1.5 sm:ml-2">
            {[
              "Online Lodgement (Apply for a visa or citizenship including sponsorship and nomination)",
              "Organisation Account Administration",
              "Visa Entitlement Verification Online (VEVO) for organisations",
            ].map((service) => (
              <div key={service} className="flex items-start">
                <input
                  type="checkbox"
                  id={service}
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="mt-[2px] mr-2"
                />
                <label htmlFor={service} className="text-[13px]">
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#e5e5e5] px-4 py-3 border-t border-gray-300 flex justify-between mt-auto">
        <button
          type="button"
          className="bg-[#eeeeee] border border-gray-400 px-4 py-1 text-[12px] text-black hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isCreatingRequest}
          onClick={onAccessRequestSubmit}
          className="bg-[#eeeeee] border border-gray-400 px-6 py-1 text-[12px] text-black hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-50"
        >
          {isCreatingRequest ? "Submitting..." : "Request"}
        </button>
      </div>
    </div>
  );
};
