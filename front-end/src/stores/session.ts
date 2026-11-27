import { defineStore } from "pinia";
import { shallowRef } from "vue";

type Session = {
  accessToken: string;
  refreshToken: string;
};

export const useSessionStore = defineStore("session", () => {
  const session = shallowRef<Session | null>(null);

  async function authenticate(path: string, body: object, invalidMessage: string) {
    const response = await fetch(`${import.meta.env.BASE_URL}api/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error(invalidMessage);
    }
    if (!response.ok) {
      throw new Error("La connexion est indisponible pour le moment.");
    }

    const tokens: Partial<Session> = await response.json();
    if (typeof tokens.accessToken !== "string" || typeof tokens.refreshToken !== "string") {
      throw new Error("La réponse du service de connexion est invalide.");
    }

    session.value = { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  function login(email: string, password: string) {
    return authenticate("login", { email, password }, "L’adresse e-mail ou le mot de passe est incorrect.");
  }

  function loginWithGoogle(idToken: string, role: "student" | "particular") {
    return authenticate("google/login", { idToken, role }, "La connexion avec Google a été refusée.");
  }

  return { session, login, loginWithGoogle };
});
