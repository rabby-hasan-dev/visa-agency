import React from "react";
import { UpdateForm } from "./UpdateForm";
import { ApplicationData } from "./types";

interface UpdateDetailsTabProps {
  activeUpdateForm: string | null;
  setActiveUpdateForm: (type: string | null) => void;
  application: ApplicationData;
  id: string;
}

export const UpdateDetailsTab = ({
  activeUpdateForm,
  setActiveUpdateForm,
  application,
  id,
}: UpdateDetailsTabProps) => {
  return (
    <>
      {!activeUpdateForm ? (
        <>
          <div className="flex justify-between items-center mb-[10px]">
            <h2 className="text-[#2150a0] font-bold text-[15px] flex items-center gap-[5px]">
              Update details
              <span className="bg-[#00264d] text-white rounded-full w-[14px] h-[14px] text-[10px] flex items-center justify-center">
                ?
              </span>
            </h2>
          </div>
          <div className="text-[13px] text-[#333]">
            <p className="mb-1">
              You can provide updated information to the department using the
              links below.
            </p>
            <div className="flex flex-col gap-0.5">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveUpdateForm("address");
                }}
                className="text-[#2150a0] underline"
              >
                Change of address details
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveUpdateForm("contact");
                }}
                className="text-[#2150a0] underline"
              >
                Change of contact telephone numbers
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveUpdateForm("email");
                }}
                className="text-[#2150a0] underline"
              >
                Change of email address details
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveUpdateForm("passport");
                }}
                className="text-[#2150a0] underline"
              >
                Change of passport details
              </a>
            </div>
          </div>
        </>
      ) : (
        <UpdateForm
          type={activeUpdateForm}
          onCancel={() => setActiveUpdateForm(null)}
          application={application}
          trn={id.slice(-10).toUpperCase()}
          applicationId={id}
        />
      )}
    </>
  );
};
