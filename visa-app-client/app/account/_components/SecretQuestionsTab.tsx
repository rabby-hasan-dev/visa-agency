import { UseFormReturn } from "react-hook-form";
import * as schemas from "@/schemas/profile.schema";
import { InputRow } from "./InputRow";

interface SecretQuestionsTabProps {
  secretQuestionsForm: UseFormReturn<schemas.SecretQuestionsUpdateValues>;
  onSubmit: (data: schemas.SecretQuestionsUpdateValues) => Promise<void>;
}

export const SecretQuestionsTab = ({
  secretQuestionsForm,
  onSubmit,
}: SecretQuestionsTabProps) => {
  return (
    <form
      onSubmit={secretQuestionsForm.handleSubmit(onSubmit)}
      className="bg-white border border-gray-300 shadow-sm min-h-[500px] flex flex-col"
    >
      <div className="bg-[#1b3564] text-white font-bold text-[13px] px-3 py-1.5">
        Secret Questions
      </div>
      <div className="p-5 flex-1">
        <p className="mb-3 text-[13px] text-black">
          Enter the following details to update your secret questions and select
          &apos;Save&apos; to apply your changes:
        </p>
        <p className="mb-6 text-[13px] text-black">
          Fields marked <span className="text-[#c41a1f]">*</span> must be
          completed.
        </p>

        <div className="space-y-6">
          {/* Question 1 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-1">
              <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
                Question 1 <span className="text-[#c41a1f]">*</span>
              </label>
              <div className="flex-1 w-full sm:w-auto">
                <select
                  {...secretQuestionsForm.register("q1")}
                  className={`border ${secretQuestionsForm.formState.errors.q1 ? "border-[#c41a1f]" : "border-gray-400"} px-1 py-1 w-full sm:w-[280px] text-[13px] rounded-none focus:outline-none`}
                >
                  <option value="What is your favourite movie?">
                    What is your favourite movie?
                  </option>
                  <option value="What was your first pet's name?">
                    What was your first pet&apos;s name?
                  </option>
                  <option value="In what city were you born?">
                    In what city were you born?
                  </option>
                </select>
              </div>
            </div>
            <InputRow
              label="Answer 1"
              isRequired
              registerProps={secretQuestionsForm.register("a1")}
              error={secretQuestionsForm.formState.errors.a1?.message}
            />
          </div>

          {/* Question 2 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-1">
              <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
                Question 2 <span className="text-[#c41a1f]">*</span>
              </label>
              <div className="flex-1 w-full sm:w-auto">
                <select
                  {...secretQuestionsForm.register("q2")}
                  className={`border ${secretQuestionsForm.formState.errors.q2 ? "border-[#c41a1f]" : "border-gray-400"} px-1 py-1 w-full sm:w-[280px] text-[13px] rounded-none focus:outline-none`}
                >
                  <option value="What is the name of your favourite teacher?">
                    What is the name of your favourite teacher?
                  </option>
                  <option value="What is your mother's maiden name?">
                    What is your mother&apos;s maiden name?
                  </option>
                </select>
              </div>
            </div>
            <InputRow
              label="Answer 2"
              isRequired
              registerProps={secretQuestionsForm.register("a2")}
              error={secretQuestionsForm.formState.errors.a2?.message}
            />
          </div>

          {/* Question 3 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-1">
              <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
                Question 3 <span className="text-[#c41a1f]">*</span>
              </label>
              <div className="flex-1 w-full sm:w-auto">
                <select
                  {...secretQuestionsForm.register("q3")}
                  className={`border ${secretQuestionsForm.formState.errors.q3 ? "border-[#c41a1f]" : "border-gray-400"} px-1 py-1 w-full sm:w-[280px] text-[13px] rounded-none focus:outline-none`}
                >
                  <option value="Name your favourite holiday destination.">
                    Name your favourite holiday destination.
                  </option>
                  <option value="What is your favourite food?">
                    What is your favourite food?
                  </option>
                </select>
              </div>
            </div>
            <InputRow
              label="Answer 3"
              isRequired
              registerProps={secretQuestionsForm.register("a3")}
              error={secretQuestionsForm.formState.errors.a3?.message}
            />
          </div>

          {/* Question 4 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-1">
              <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
                Question 4
              </label>
              <div className="flex-1 w-full sm:w-auto">
                <select
                  {...secretQuestionsForm.register("q4")}
                  className={`border ${secretQuestionsForm.formState.errors.q4 ? "border-[#c41a1f]" : "border-gray-400"} px-1 py-1 w-full sm:w-[280px] text-[13px] rounded-none focus:outline-none`}
                >
                  <option value=""></option>
                  <option value="What is your favourite movie?">
                    What is your favourite movie?
                  </option>
                  <option value="What was your first pet's name?">
                    What was your first pet&apos;s name?
                  </option>
                  <option value="In what city were you born?">
                    In what city were you born?
                  </option>
                  <option value="What is the name of your favourite teacher?">
                    What is the name of your favourite teacher?
                  </option>
                  <option value="What is your mother's maiden name?">
                    What is your mother&apos;s maiden name?
                  </option>
                  <option value="Name your favourite holiday destination.">
                    Name your favourite holiday destination.
                  </option>
                  <option value="What is your favourite food?">
                    What is your favourite food?
                  </option>
                </select>
              </div>
            </div>
            <InputRow
              label="Answer 4"
              registerProps={secretQuestionsForm.register("a4")}
              error={secretQuestionsForm.formState.errors.a4?.message}
            />
          </div>

          {/* Question 5 */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-1">
              <label className="w-full sm:w-[180px] text-[13px] text-gray-800 font-sans mb-1.5 sm:mb-0">
                Question 5
              </label>
              <div className="flex-1 w-full sm:w-auto">
                <select
                  {...secretQuestionsForm.register("q5")}
                  className={`border ${secretQuestionsForm.formState.errors.q5 ? "border-[#c41a1f]" : "border-gray-400"} px-1 py-1 w-full sm:w-[280px] text-[13px] rounded-none focus:outline-none`}
                >
                  <option value=""></option>
                  <option value="What is your favourite movie?">
                    What is your favourite movie?
                  </option>
                  <option value="What was your first pet's name?">
                    What was your first pet&apos;s name?
                  </option>
                  <option value="In what city were you born?">
                    In what city were you born?
                  </option>
                  <option value="What is the name of your favourite teacher?">
                    What is the name of your favourite teacher?
                  </option>
                  <option value="What is your mother's maiden name?">
                    What is your mother&apos;s maiden name?
                  </option>
                  <option value="Name your favourite holiday destination.">
                    Name your favourite holiday destination.
                  </option>
                  <option value="What is your favourite food?">
                    What is your favourite food?
                  </option>
                </select>
              </div>
            </div>
            <InputRow
              label="Answer 5"
              registerProps={secretQuestionsForm.register("a5")}
              error={secretQuestionsForm.formState.errors.a5?.message}
            />
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
