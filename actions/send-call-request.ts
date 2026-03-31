// Server Actions are not supported on GitHub Pages (static export)
// This file is kept for local development reference only.

export async function sendCallRequest(prevState: any, formData: FormData) {
  return {
    success: false,
    message: "Les formulaires ne sont pas disponibles sur la version statique GitHub Pages.",
  };
}
