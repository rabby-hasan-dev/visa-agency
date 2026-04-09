export { StepTerms } from "./StepTerms";
export { StepContext } from "./StepContext";
export { StepVisitorContext } from "./StepVisitorContext";
export { StepStudentContext } from "./StepStudentContext";
export { StepApplicantDetails } from "./StepApplicantDetails";
export { StepDataConfirmation } from "./StepDataConfirmation";
export { StepContactDetails } from "./StepContactDetails";
export { StepAuthorisedRecipient } from "./StepAuthorisedRecipient";
export { StepHealthDeclarations } from "./StepHealthDeclarations";
export { StepCharacterDeclarations } from "./StepCharacterDeclarations";
export { StepFinalDeclarations } from "./StepFinalDeclarations";
export { StepNonAccompanyingFamily } from "./StepNonAccompanyingFamily";
export { StepPreviousTravel } from "./StepPreviousTravel";
export { StepGeneric } from "./StepGeneric";


import type React from "react";

import { StepTerms } from "./StepTerms";
import { StepContext } from "./StepContext";
import { StepVisitorContext } from "./StepVisitorContext";
import { StepStudentContext } from "./StepStudentContext";
import { StepApplicantDetails } from "./StepApplicantDetails";
import { StepDataConfirmation } from "./StepDataConfirmation";
import { StepContactDetails } from "./StepContactDetails";
import { StepAuthorisedRecipient } from "./StepAuthorisedRecipient";
import { StepHealthDeclarations } from "./StepHealthDeclarations";
import { StepCharacterDeclarations } from "./StepCharacterDeclarations";
import { StepFinalDeclarations } from "./StepFinalDeclarations";
import { StepNonAccompanyingFamily } from "./StepNonAccompanyingFamily";
import { StepPreviousTravel } from "./StepPreviousTravel";
import { StepGeneric } from "./StepGeneric";

// Map component key strings from visaConfig to actual React components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const STEP_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    Step1: StepTerms,
    Step2: StepContext,
    StepVisitorContext: StepVisitorContext,
    StepStudentContext: StepStudentContext,
    Step3: StepApplicantDetails,
    Step4: StepDataConfirmation,
    Step5: StepContactDetails,
    Step6: StepAuthorisedRecipient,
    Step8: StepHealthDeclarations,
    Step9: StepCharacterDeclarations,
    Step12: StepFinalDeclarations,
    StepNonAccompanyingFamily: StepNonAccompanyingFamily,
    StepPreviousTravel: StepPreviousTravel,
    StepGeneric: StepGeneric,
};
