import { UseFormReturn } from "react-hook-form";
import * as schemas from "@/schemas/profile.schema";
import { HelpCircle, Loader2 } from "lucide-react";

interface SecretQuestionsTabProps {
  secretQuestionsForm: UseFormReturn<schemas.SecretQuestionsUpdateValues>;
  onSubmit: (data: schemas.SecretQuestionsUpdateValues) => Promise<void>;
}

const ALL_QUESTIONS = [
  "What is your favourite movie?",
  "What was your first pet's name?",
  "In what city were you born?",
  "What is the name of your favourite teacher?",
  "What is your mother's maiden name?",
  "Name your favourite holiday destination.",
  "What is your favourite food?",
];

const Q_SETS: Record<number, string[]> = {
  1: ["What is your favourite movie?", "What was your first pet's name?", "In what city were you born?"],
  2: ["What is the name of your favourite teacher?", "What is your mother's maiden name?"],
  3: ["Name your favourite holiday destination.", "What is your favourite food?"],
};

type QKey = "q1" | "q2" | "q3" | "q4" | "q5";
type AKey = "a1" | "a2" | "a3" | "a4" | "a5";

const QUESTIONS: { num: number; qKey: QKey; aKey: AKey; required: boolean; options: string[] }[] = [
  { num: 1, qKey: "q1", aKey: "a1", required: true, options: Q_SETS[1] },
  { num: 2, qKey: "q2", aKey: "a2", required: true, options: Q_SETS[2] },
  { num: 3, qKey: "q3", aKey: "a3", required: true, options: Q_SETS[3] },
  { num: 4, qKey: "q4", aKey: "a4", required: false, options: ALL_QUESTIONS },
  { num: 5, qKey: "q5", aKey: "a5", required: false, options: ALL_QUESTIONS },
];

export const SecretQuestionsTab = ({ secretQuestionsForm, onSubmit }: SecretQuestionsTabProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = secretQuestionsForm;

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <HelpCircle size={16} className="text-gray-400" />
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Secret Questions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Used to verify your identity if you forget your password</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {QUESTIONS.map(({ num, qKey, aKey, required, options }) => (
              <div key={num} className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {num}
                  </span>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Question {num} {required && <span className="text-blue-500 normal-case tracking-normal">*</span>}
                    {!required && <span className="text-gray-400 normal-case tracking-normal font-normal"> (optional)</span>}
                  </span>
                </div>

                {/* Question select */}
                <select
                  {...register(qKey)}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                    errors[qKey] ? "border-rose-400 bg-rose-50" : "border-gray-200 focus:border-blue-400"
                  }`}
                >
                  {!required && <option value="">— Select a question —</option>}
                  {options.map(q => <option key={q} value={q}>{q}</option>)}
                </select>

                {/* Answer input */}
                <input
                  {...register(aKey)}
                  placeholder="Your answer"
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                    errors[aKey] ? "border-rose-400 bg-rose-50" : "border-gray-200 focus:border-blue-400"
                  }`}
                />
                {(errors[qKey] || errors[aKey]) && (
                  <p className="text-xs text-rose-500">
                    {errors[qKey]?.message || errors[aKey]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => secretQuestionsForm.reset()}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Questions"}
          </button>
        </div>
      </form>
    </div>
  );
};
