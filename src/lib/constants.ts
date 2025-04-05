
import { DayOfWeek, TimeOfDay } from "@/types";

export const daysOfWeekLabels: Record<DayOfWeek, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

export const timeOfDayLabels: Record<TimeOfDay, string> = {
  morning: "Matin",
  noon: "Midi",
  evening: "Soir",
  night: "Nuit",
  repas: "Repas",
  avant_repas: "Avant repas",
  apres_repas: "Après repas",
  custom: "Personnalisé",
};

export const daysOfWeekOptions = Object.entries(daysOfWeekLabels).map(([value, label]) => ({
  value,
  label,
}));

export const timeOfDayOptions = Object.entries(timeOfDayLabels).map(([value, label]) => ({
  value,
  label,
}));
