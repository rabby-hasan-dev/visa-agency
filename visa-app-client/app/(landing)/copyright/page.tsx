"use client";

export default function CopyrightPage() {
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="bg-[#1a2b4a] h-11 flex items-center px-5 text-white text-lg font-bold">
        Copyright
      </div>
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white border border-gray-300 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#2150a0] mb-6">
            Copyright Notice
          </h1>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            &copy; {new Date().getFullYear()} Department of Home Affairs. All
            rights reserved.
          </p>
          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            Ownership of Content
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            The material on this website, including but not limited to the
            software, layout, design, text, graphics and images, is protected by
            copyright under the laws of Australia and other countries.
          </p>
          <h2 className="text-lg font-bold text-[#1a2b4a] mt-6 mb-3">
            Permitted Uses
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            You may be permitted to print, copy, and download small excerpts for
            personal use provided you retain all copyright and other proprietary
            notices. You must not modify, publish, transmit, or reproduce any
            material herein for commercial purposes without prior written
            authorization from the Department.
          </p>
        </div>
      </div>
    </div>
  );
}

