"use client";

export default function SecurityPage() {
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="bg-[#1a2b4a] h-11 flex items-center px-5 text-white text-lg font-bold">
        Online Security
      </div>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white border border-gray-300 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#2150a0] mb-6">
            Online Security Statement
          </h1>

          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            The Department is committed to ensuring that your information is
            secure. In order to prevent unauthorized access or disclosure, we
            have put in place suitable physical, electronic, and managerial
            procedures to safeguard and secure the information we collect
            online.
          </p>

          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            How we protect your data
          </h2>
          <ul className="list-disc ml-6 text-sm text-gray-700 space-y-2 mb-6">
            <li>All transmissions are encrypted via SSL/TLS certificates.</li>
            <li>
              Regular security audits and infrastructure penetration testing.
            </li>
            <li>
              Multi-factor authentication (MFA) protocols for system
              administrators.
            </li>
            <li>
              Strict access controls and firewalls restricting access to
              sensitive databases.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            How you can protect yourself
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            While we take significant precautions to secure your data, online
            security is also your responsibility:
          </p>
          <ul className="list-disc ml-6 text-sm text-gray-700 space-y-2 mb-6">
            <li>Never share your passwords, tokens, or PINs with anyone.</li>
            <li>
              Ensure you are using the official Department website by verifying
              the URL.
            </li>
            <li>Log out of your session on public or shared computers.</li>
            <li>Keep your operating system and web browser updated.</li>
          </ul>

          <p className="text-sm text-gray-700 mt-6 pt-6 border-t border-gray-200">
            If you suspect any fraudulent activity or a breach concerning your
            ImmiAccount, you should immediately contact our cyber security
            support team.
          </p>
        </div>
      </div>
    </div>
  );
}

