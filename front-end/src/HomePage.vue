<script setup lang="ts">
import { RouterLink } from "vue-router";
import Button from "primevue/button";
import Card from "primevue/card";
import Tag from "primevue/tag";
const examples = [
  {
    category: "Événementiel",
    title: "Accueil du public",
    description:
      "Orienter les visiteurs et renseigner les participants lors d'un événement.",
  },
  {
    category: "Commerce",
    title: "Renfort en boutique",
    description:
      "Accueillir les clients et aider l'équipe à préparer le magasin.",
  },
  {
    category: "Soutien scolaire",
    title: "Aide aux devoirs",
    description:
      "Accompagner un élève dans ses révisions et l'aider à s'organiser.",
  },
];
</script>

<template>
  <div class="min-h-screen bg-violet-50/40 font-sans text-slate-900">
    <header class="border-b border-violet-100 bg-white">
      <div
        class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-8"
      >
        <a
          class="inline-flex items-center gap-2.5 rounded-sm font-extrabold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-700"
          href="#accueil"
        >
          <span
            class="grid size-8 place-items-center rounded-lg bg-violet-700 text-white"
            aria-hidden="true"
            >↗</span
          >
          Mission Étudiant
        </a>
        <nav
          class="flex flex-wrap items-center gap-4"
          aria-label="Navigation principale"
        >
          <Button
            :as="RouterLink"
            :to="{ name: 'login', param: { role: 'particular'} }"
            label="Je suis un particulier"
            size="small"
            outlined
          />
          <Button
            :as="RouterLink"
            :to="{ name: 'login', param:{role: 'student'} }"
            label="Je suis Etudiant"
            size="small"
            outlined
          />
        </nav>
      </div>
    </header>

    <main id="accueil">
      <section class="bg-violet-100" aria-labelledby="hero-title">
        <div
          class="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:py-28"
        >
          <h1
            id="hero-title"
            class="max-w-3xl text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Des missions qui s'adaptent à
            <em class="text-violet-700 not-italic">tes études.</em>
          </h1>
          <p class="mt-6 mb-8 max-w-xl text-base text-slate-700 sm:text-xl">
            Explore des idées de missions ponctuelles pour te faire de
            l’expérience et gagner un revenu à côté des cours.
          </p>
          <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              as="a"
              href="#missions"
              label="Etudiant"
            />
            <Button
              as="a"
              href="#particulier"
              label="Particulier"
              outlined
            />
          </div>
        </div>
      </section>

      <section
        id="missions"
        class="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-20"
        aria-labelledby="missions-title"
      >
        <h2
          id="missions-title"
          class="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          Exemples de missions
        </h2>
        <ul
          role="list"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <li v-for="example in examples" :key="example.title">
            <Card class="h-full">
              <template #title>
                <Tag :value="example.category" severity="secondary" />
                <h3 class="mt-3 text-xl font-bold">{{ example.title }}</h3>
              </template>
              <template #content>
                <p class="text-slate-700">{{ example.description }}</p>
              </template>
            </Card>
          </li>
        </ul>
      </section>

      <section
        id="particulier"
        class="mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8 lg:pb-20"
        aria-labelledby="particulier-title"
      >
        <Card>
          <template #title>
            <h2 id="particulier-title">Vous avez besoin d'un coup de main ?</h2>
          </template>
          <template #content>
            <p>
              Pour préparer une mission, décrivez la tâche, le lieu, les
              horaires et la rémunération.
            </p>
          </template>
        </Card>
      </section>
    </main>
  </div>
</template>
