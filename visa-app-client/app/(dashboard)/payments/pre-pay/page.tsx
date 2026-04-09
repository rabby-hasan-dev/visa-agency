"use client";

import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrePayPaperServicePage() {
  const router = useRouter();

  return (
    <div style={{ background: "#f0f2f5", minHeight: "80vh", padding: "20px" }}>
      {/* Container Box */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #00264d",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#00264d",
            color: "#fff",
            padding: "6px 15px",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Pre-pay Paper Service
        </div>

        <div style={{ padding: "25px 15px" }}>
          {/* Warning Message */}
          <p
            style={{
              color: "#d00",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 15,
            }}
          >
            Application must be lodged within 30 days of making the payment.
          </p>

          {/* Form Content */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              marginBottom: 25,
            }}
          >
            <label style={{ fontSize: 12, color: "#333" }}>
              What payment are you making?
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <select
                style={{
                  border: "1px solid #ccc",
                  padding: "4px 8px",
                  fontSize: 12,
                  width: 300,
                  outline: "none",
                }}
              >
                <option value="">--Select--</option>
                <option value="visa">Visa Application Charge</option>
                <option value="sponsorship">Sponsorship</option>
                <option value="nomination">Nomination</option>
              </select>
              <HelpCircle
                size={18}
                style={{ color: "#00264d", cursor: "help" }}
              />
            </div>
          </div>

          {/* Footer/Action Bar */}
          <div
            style={{
              background: "#e5e5e5",
              padding: "8px 15px",
              border: "1px solid #ccc",
              display: "flex",
            }}
          >
            <button
              onClick={() => router.back()}
              style={{
                padding: "2px 15px",
                fontSize: 12,
                background: "#f5f5f5",
                border: "1px solid #999",
                cursor: "pointer",
                boxShadow: "inset 0 1px 0 #fff",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
