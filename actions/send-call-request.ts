"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro invalide"),
  message: z.string().optional(),
});

export async function sendCallRequest(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Formulaire invalide",
    };
  }

  // Simulate delay / DB call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log("Nouveau message reçu:", validatedFields.data);

  return {
    success: true,
    message: "Demande envoyée ! Nous vous rappelons sous 24h.",
  };
}
