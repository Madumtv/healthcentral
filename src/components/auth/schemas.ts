import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
});

export const signupSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;