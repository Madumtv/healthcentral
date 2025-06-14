
export const MEDICATION_SELECT_QUERY = `
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
