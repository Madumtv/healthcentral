
// Re-export everything for backward compatibility
export * from './medicaments/types';
export { MedicamentsApiService } from './medicaments/api-service';

// Create and export the service instance
import { MedicamentsApiService } from './medicaments/api-service';
export const medicamentsApi = new MedicamentsApiService();
