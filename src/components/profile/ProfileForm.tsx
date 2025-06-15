
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthDate: z.date().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialValues: ProfileFormValues;
  user: User | null;
  onSuccess: (values: ProfileFormValues) => void;
}

export function ProfileForm({ initialValues, user, onSuccess }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log("🔧 ProfileForm - Valeurs initiales reçues:", initialValues);
  console.log("🔧 ProfileForm - User ID:", user?.id);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialValues,
  });

  // Mettre à jour le formulaire quand les valeurs initiales changent
  useEffect(() => {
    console.log("🔄 Mise à jour du formulaire avec les nouvelles valeurs:", initialValues);
    const currentValues = form.getValues();
    const hasChanged = 
      currentValues.name !== initialValues.name ||
      currentValues.firstName !== initialValues.firstName ||
      currentValues.lastName !== initialValues.lastName ||
      currentValues.birthDate?.getTime() !== initialValues.birthDate?.getTime();
    
    if (hasChanged) {
      console.log("📝 Reset du formulaire avec nouvelles valeurs");
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) {
      console.error("❌ Pas d'utilisateur connecté");
      toast.error("Utilisateur non connecté");
      return;
    }

    setIsSubmitting(true);
    console.log("🔄 Début de la sauvegarde du profil:", values);
    console.log("👤 ID utilisateur:", user.id);

    try {
      // Vérifier que l'utilisateur existe dans la table profiles
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("❌ Erreur lors de la vérification du profil:", checkError);
        throw new Error(`Erreur de vérification: ${checkError.message}`);
      }

      const updateData = {
        name: values.name,
        first_name: values.firstName || null,
        last_name: values.lastName || null,
        birth_date: values.birthDate ? values.birthDate.toISOString() : null,
        updated_at: new Date().toISOString()
      };

      console.log("💾 Données à sauvegarder:", updateData);

      let result;
      if (!existingProfile) {
        // Créer un nouveau profil si il n'existe pas
        console.log("➕ Création d'un nouveau profil");
        result = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            ...updateData
          })
          .select();
      } else {
        // Mettre à jour le profil existant
        console.log("🔄 Mise à jour du profil existant");
        result = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id)
          .select();
      }

      const { data, error } = result;

      if (error) {
        console.error("❌ Erreur lors de la sauvegarde:", error);
        throw new Error(`Erreur de sauvegarde: ${error.message}`);
      }

      console.log("✅ Profil sauvegardé avec succès:", data);
      
      onSuccess(values);
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du profil:", error);
      toast.error(error instanceof Error ? error.message : "La mise à jour du profil a échoué.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de famille</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom de famille" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d'affichage</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom d'affichage" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de naissance</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "P", { locale: fr })
                      ) : (
                        <span>Sélectionnez une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {user && (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input 
              type="email" 
              value={user.email || ""} 
              disabled 
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              L'email est associé à votre compte et ne peut pas être modifié ici.
            </p>
          </FormItem>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  );
}
