
import { medicationReadService } from "./medication/medication-read-service";
import { medicationWriteService } from "./medication/medication-write-service";

export const supabaseMedicationService = {
  ...medicationReadService,
  ...medicationWriteService,
};
