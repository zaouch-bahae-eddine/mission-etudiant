<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Button from "primevue/button";
import Message from "primevue/message";
import Select from "primevue/select";

type Role = "student" | "particular";
type Identity = {
  initialize(options: { client_id: string; callback: (response: { credential: string }) => void }): void;
  renderButton(element: HTMLElement, options: { theme: string; size: string; locale: string }): void;
};

defineProps<{ disabled: boolean }>();
const emit = defineEmits<{ credential: [token: string, role: Role] }>();
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const container = ref<HTMLElement>();
const role = ref<Role | null>(null);
const loadFailed = ref(false);
const roles = [
  { label: "Étudiant", value: "student" },
  { label: "Particulier", value: "particular" },
];

let script: HTMLScriptElement | undefined;

function render() {
  const identity = (window as Window & { google?: { accounts?: { id?: Identity } } }).google?.accounts?.id;
  if (!clientId || !container.value) return;
  if (!identity) {
    loadFailed.value = true;
    return;
  }

  identity.initialize({
    client_id: clientId,
    callback: ({ credential }) => {
      if (container.value && role.value) emit("credential", credential, role.value);
    },
  });
  identity.renderButton(container.value, { theme: "outline", size: "large", locale: "fr" });
}

onMounted(() => {
  if (!clientId) return;
  if ("google" in window) {
    render();
    return;
  }
  script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.onload = render;
  script.onerror = () => { loadFailed.value = true; };
  document.head.append(script);
});

onUnmounted(() => script?.remove());
</script>

<template>
  <div class="grid gap-3 border-t border-violet-200 pt-5">
    <template v-if="clientId && !loadFailed">
      <label for="google-role" class="font-medium">Profil pour la connexion Google</label>
      <Select
        v-model="role"
        input-id="google-role"
        :options="roles"
        option-label="label"
        option-value="value"
        placeholder="Choisir un profil"
        :disabled="disabled"
        fluid
      />
      <div v-show="role && !disabled" ref="container"></div>
    </template>
    <template v-else>
      <Button label="Se connecter avec Google" severity="secondary" outlined disabled />
      <Message severity="secondary">La connexion Google est actuellement indisponible.</Message>
    </template>
  </div>
</template>
