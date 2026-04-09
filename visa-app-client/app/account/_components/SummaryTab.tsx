import { useRouter } from "next/navigation";

import { TUser, TProfile } from "@/types/user";

interface SummaryTabProps {
  user: TUser;
  profile: TProfile;
  setActiveTab: (tab: string) => void;
}

export const SummaryTab = ({ user, profile, setActiveTab }: SummaryTabProps) => {
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-300 shadow-sm min-h-[500px]">
      <div className="bg-[#1b3564] text-white font-bold text-[13px] px-3 py-1.5">
        Summary
      </div>
      <div className="p-5">
        <h3 className="text-[#1b3564] text-[18px] font-normal mb-2 mt-0">
          My services
        </h3>
        <p className="mb-4 text-[13px]">
          You have access to the following services and can request access to
          additional services from the{" "}
          <a
            href="#"
            className="underline text-[#1b3564]"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("Request access");
            }}
          >
            Request access
          </a>{" "}
          tab.
        </p>
        <ul className="list-disc pl-5 mb-8 text-[#1b3564] text-[13px] space-y-1">
          <li>
            <a href="#" className="underline hover:text-blue-800">
              Detention Visitor Application
            </a>
          </li>
          <li>
            <a href="/payments" className="underline hover:text-blue-800">
              Manage Payments
            </a>
          </li>
          <li>
            <a href="/dashboard" className="underline hover:text-blue-800">
              Online Lodgement (Apply for a visa or citizenship including
              sponsorship and nomination) - Individual
            </a>
          </li>
          <li>
            <a href="#" className="underline hover:text-blue-800">
              LEGENDcom
            </a>
          </li>
        </ul>

        <div className="border-t border-dashed border-gray-300 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-y-3 sm:gap-y-1.5 text-[13px]">
          <div className="text-gray-900">Given names</div>
          <div>
            {user?.name?.split(" ")[0] || "rahman"}{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Account details");
              }}
              className="text-[#1b3564] underline"
            >
              (edit given name)
            </a>
          </div>

          <div className="text-gray-900">Family name</div>
          <div>
            {user?.name?.split(" ").slice(1).join(" ") || "syed"}{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Account details");
              }}
              className="text-[#1b3564] underline"
            >
              (edit family name)
            </a>
          </div>

          <div className="text-gray-900">Email address</div>
          <div>
            {user?.email || "ghave763@gmail.com"}{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Email address");
              }}
              className="text-[#1b3564] underline"
            >
              (edit email address)
            </a>
          </div>

          <div className="text-gray-900">Username</div>
          <div className="mb-6">{user?.email || "ghave763@gmail.com"}</div>

          {user?.role === "agent" && (
            <>
              <div className="text-gray-900">Organisation</div>
              <div className="mb-6">
                {profile?.companyName || "N/A"}{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("Account details");
                  }}
                  className="text-[#1b3564] underline"
                >
                  (edit organisation)
                </a>
              </div>
            </>
          )}

          <div className="text-gray-900">
            {user?.role === "agent" ? "Business address" : "Street address"}
          </div>
          <div>
            {[
              profile?.streetAddress ||
                profile?.businessAddress ||
                profile?.address?.street,
              profile?.city || profile?.address?.city,
              profile?.stateProvince || profile?.state || profile?.address?.state,
              profile?.zipPostalCode || profile?.address?.zipCode,
              profile?.country || profile?.address?.country,
            ]
              .filter(Boolean)
              .join(", ") || "N/A"}{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Account details");
              }}
              className="text-[#1b3564] underline"
            >
              (edit {user?.role === "agent" ? "business" : "street"} address)
            </a>
          </div>

          <div className="text-gray-900">Alerts</div>
          <div>
            I will receive account alerts{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Alert preferences");
              }}
              className="text-[#1b3564] underline"
            >
              (change my account alert preferences)
            </a>
          </div>

          <div className="text-gray-900">Password</div>
          <div>
            Password saved{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Password");
              }}
              className="text-[#1b3564] underline"
            >
              (change my password)
            </a>
          </div>

          <div className="text-gray-900">Secret questions</div>
          <div>
            Secret questions saved{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Secret questions");
              }}
              className="text-[#1b3564] underline"
            >
              (change my secret questions)
            </a>
          </div>

          <div className="text-gray-900">Terms and conditions</div>
          <div>
            <a href="#" className="text-[#1b3564] underline">
              View the ImmiAccount terms and conditions (opens in a new window)
            </a>
          </div>

          <div className="text-gray-900 mt-1">Delete account</div>
          <div className="mt-1">
            <a href="#" className="text-[#1b3564] underline">
              Delete my ImmiAccount
            </a>
          </div>
        </div>
      </div>
      <div className="bg-[#e5e5e5] px-4 py-3 border-t border-gray-300 mt-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-[#eeeeee] border border-gray-400 px-4 py-1.5 text-[12px] text-gray-800 hover:bg-gray-200"
        >
          Return to Online Lodgement
        </button>
      </div>
    </div>
  );
};
