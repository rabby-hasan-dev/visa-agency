import { TProfile } from "@/types/user";

interface AlertPreferencesTabProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  profile: TProfile;
}

export const AlertPreferencesTab = ({
  onSubmit,
  profile,
}: AlertPreferencesTabProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-gray-300 shadow-sm min-h-[500px] flex flex-col"
    >
      <div className="bg-[#1b3564] text-white font-bold text-[13px] px-3 py-1.5">
        Alert preferences
      </div>
      <div className="p-5 flex-1">
        <p className="mb-4 text-[13px] text-black">
          You will receive alerts for the following events via the email address
          you saved in your ImmiAccount.
        </p>
        <ul className="list-disc pl-8 mb-6 text-[13px]">
          <li>Change secret question and answer</li>
          <li>Delete account</li>
          <li>Forgot login id</li>
          <li>Forgot password</li>

          <li>New browser login</li>
          <li>Verify email</li>
        </ul>

        <p className="mb-4 text-[13px] text-black">
          You can change the following optional alert preferences. Select
          &apos;Save&apos; to apply your changes.
        </p>

        <h3 className="font-bold text-[13px] mb-2 mt-0">Optional alerts</h3>

        <div className="sm:ml-[180px] space-y-2">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="alertPassword"
              name="alertPassword"
              defaultChecked={profile?.alertPassword ?? true}
              className="mr-2"
            />
            <label htmlFor="alertPassword" className="text-[13px]">
              Change password
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="alertUserDetails"
              name="alertUserDetails"
              defaultChecked={profile?.alertUserDetails ?? true}
              className="mr-2"
            />
            <label htmlFor="alertUserDetails" className="text-[13px]">
              User details changed
            </label>
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
          type="submit"
          className="bg-[#eeeeee] border border-gray-400 px-6 py-1 text-[12px] text-black hover:bg-gray-200 transition-colors shadow-sm"
        >
          Save
        </button>
      </div>
    </form>
  );
};
