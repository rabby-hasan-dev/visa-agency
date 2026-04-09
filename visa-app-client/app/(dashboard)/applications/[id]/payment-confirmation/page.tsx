"use client";

import { useParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function PaymentConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-10">
      <div className="bg-[#1a2b4a] h-11 flex items-center px-5 text-white text-lg font-bold">
        Payment confirmation Reference Number: EGPBHB0G2R
      </div>

      <div className="max-w-[700px] mx-auto my-10">
        <div className="bg-white border border-[#ddd] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-center">
          <div className="flex justify-center mb-5">
            <CheckCircle2 size={60} color="#2e7d32" />
          </div>

          <h2 className="text-[#2e7d32] font-bold text-2xl mb-4">
            Payment Successful
          </h2>

          <p className="text-base text-[#333] mb-2">
            Your payment has been successfully processed and your application
            has been submitted to the Department.
          </p>
          <p className="text-[15px] text-[#666] mb-8">
            A confirmation email and receipt will be sent to your registered
            email address shortly.
          </p>

          <div className="bg-[#f9f9f9] border border-[#eee] rounded-lg p-5 mb-8 text-left">
            <div className="grid grid-cols-[150px_1fr] gap-3 mb-2 text-sm">
              <span className="text-[#666]">Reference:</span>
              <span className="font-semibold">EGPBHB0G2R</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-3 mb-2 text-sm">
              <span className="text-[#666]">Amount Paid:</span>
              <span className="font-semibold">AUD 0.00</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-3 text-sm">
              <span className="text-[#666]">Date:</span>
              <span className="font-semibold">
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push(`/applications/${id}`)}
              className="text-sm py-2.5 px-6 border border-[#1a2b4a] bg-[#1a2b4a] text-white rounded font-semibold cursor-pointer"
            >
              View Application Home
            </button>
            <button
              onClick={() => router.push("/applications")}
              className="text-sm py-2.5 px-6 border border-[#999] bg-white text-[#333] rounded font-semibold cursor-pointer"
            >
              Go to My Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
