<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Password from "primevue/password";
import GoogleSignIn from "./GoogleSignIn.vue";
import { useSessionStore } from "./stores/session";

const sessionStore = useSessionStore();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function authenticate(login: () => Promise<void>) {
  if (loading.value) return;

  loading.value = true;
  error.value = "";
  try {
    await login();
    password.value = "";
  } catch (failure) {
    error.value = failure instanceof Error && !(failure instanceof TypeError || failure instanceof SyntaxError)
      ? failure.message
      : "La connexion est indisponible pour le moment.";
  } finally {
    loading.value = false;
  }
}

function submit() {
  return authenticate(() => sessionStore.login(email.value.trim(), password.value));
}

function submitGoogle(token: string, role: "student" | "particular") {
  return authenticate(() => sessionStore.loginWithGoogle(token, role));
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-violet-50 px-5 py-12">
    <div class="w-full max-w-md">
      <RouterLink class="mb-5 inline-block font-semibold text-violet-800 hover:underline" to="/">
        ← Retour à l’accueil
      </RouterLink>

      <Card>
        <template #title>
          <h1>Connexion</h1>
        </template>
        <template #content>
          <Message v-if="sessionStore.session" severity="success">
            Vous êtes connecté.
          </Message>
          <form v-else class="grid gap-5" @submit.prevent="submit">
            <div class="grid gap-2">
              <label for="login-email" class="font-medium">Adresse e-mail</label>
              <InputText id="login-email" v-model="email" type="email" autocomplete="username" fluid required />
            </div>
            <div class="grid gap-2">
              <label for="login-password" class="font-medium">Mot de passe</label>
              <Password
                v-model="password"
                input-id="login-password"
                :input-props="{ autocomplete: 'current-password', required: true }"
                :feedback="false"
                toggle-mask
                fluid
              />
            </div>
            <GoogleSignIn :disabled="loading" @credential="submitGoogle" />
            <Message v-if="error" severity="error" role="alert">{{ error }}</Message>
            <Button type="submit" label="Se connecter" :loading="loading" fluid />
          </form>
        </template>
      </Card>
    </div>
  </main>
</template>
