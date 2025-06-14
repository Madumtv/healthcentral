
export const MEDICATION_SELECT_QUERY = `
  *,
  doctors!inner (
    id,
    first_name,
    last_name,
    specialty,
    phone,
    email,
    city,
    inami_number
  )
`;

export const MEDICATION_SELECT_QUERY_WITH_OPTIONAL_DOCTOR = `
  *,
  doctors (
    id,
    first_name,
    last_name,
    specialty,
    phone,
    email,
    city,
    inami_number
  )
`;
