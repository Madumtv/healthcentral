
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .email({ message: "Veuillez entrer une adresse email valide." })
    .min(1, { message: "L'email est requis." })
    .max(255, { message: "L'email est trop long." }),
  password: z.string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
    .max(128, { message: "Le mot de passe est trop long." }),
});

export const signupSchema = z.object({
  email: z.string()
    .email({ message: "Veuillez entrer une adresse email valide." })
    .min(1, { message: "L'email est requis." })
    .max(255, { message: "L'email est trop long." }),
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
    .max(128, { message: "Le mot de passe est trop long." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre."
    }),
  name: z.string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(100, { message: "Le nom est trop long." })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "Le nom contient des caractères invalides." }),
  firstName: z.string()
    .max(50, { message: "Le prénom est trop long." })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]*$/, { message: "Le prénom contient des caractères invalides." })
    .optional(),
  lastName: z.string()
    .max(50, { message: "Le nom de famille est trop long." })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]*$/, { message: "Le nom de famille contient des caractères invalides." })
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
