<template>
  <div class="projects-showcase py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="projects-header text-center mb-12">
      <h2
        class="projects-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {{ $t("projects.title") || "Featured Projects" }}
      </h2>
      <p
        class="projects-description text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
      >
        {{
          $t("projects.description") ||
          "Explore my latest work and technical achievements"
        }}
      </p>
    </div>

    <!-- Project Filters -->
    <div class="projects-filters mb-12">
      <div class="filter-buttons flex flex-wrap justify-center gap-3">
        <UButton
          v-for="filter in filters"
          :key="filter.id"
          :variant="activeFilter === filter.id ? 'solid' : 'outline'"
          :color="activeFilter === filter.id ? 'primary' : 'gray'"
          size="md"
          @click="setActiveFilter(filter.id)"
        >
          <template #leading>
            <UIcon :name="filter.icon" class="w-4 h-4" />
          </template>
          {{ $t(`projects.filters.${filter.id}`) || filter.label }}
        </UButton>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid mb-12">
      <TransitionGroup
        name="project-card"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card hover:scale-[1.02] transition-transform duration-300"
          :ui="{}"
        >
          <template #header>
            <div class="project-image relative overflow-hidden">
              <img
                :src="project.image"
                :alt="project.title"
                class="project-img w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <div
                class="project-overlay absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              >
                <div class="project-actions flex gap-2">
                  <UButton
                    :to="project.demoUrl"
                    target="_blank"
                    size="sm"
                    variant="solid"
                    color="primary"
                  >
                    <template #leading>
                      <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                    </template>
                    {{ $t("projects.demo") || "Live Demo" }}
                  </UButton>
                  <UButton
                    :to="project.githubUrl"
                    target="_blank"
                    size="sm"
                    variant="outline"
                    color="gray"
                  >
                    <template #leading>
                      <UIcon name="i-heroicons-code-bracket" class="w-4 h-4" />
                    </template>
                    {{ $t("projects.code") || "Code" }}
                  </UButton>
                </div>
              </div>
            </div>
          </template>

          <div class="project-content p-6">
            <h3
              class="project-title text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              {{ project.title }}
            </h3>
            <p
              class="project-description text-gray-600 dark:text-gray-400 mb-4 line-clamp-2"
            >
              {{ project.description }}
            </p>

            <div class="project-tech flex flex-wrap gap-2 mb-4">
              <UBadge
                v-for="tech in project.technologies"
                :key="tech"
                variant="soft"
                color="primary"
                size="sm"
              >
                {{ tech }}
              </UBadge>
            </div>

            <div class="project-meta flex justify-between items-center text-sm">
              <span class="project-date text-gray-500 dark:text-gray-400">
                {{ formatDate(project.date) }}
              </span>
              <UBadge
                :color="
                  project.status === 'completed'
                    ? 'green'
                    : project.status === 'in-progress'
                      ? 'yellow'
                      : 'gray'
                "
                variant="subtle"
                size="sm"
              >
                {{ $t(`projects.status.${project.status}`) || project.status }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </TransitionGroup>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore" class="projects-load-more text-center">
      <UButton
        @click="loadMore"
        size="lg"
        variant="outline"
        color="primary"
        :loading="loading"
        class="min-w-[200px]"
      >
        {{ $t("projects.loadMore") || "Load More Projects" }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  demoUrl: string;
  githubUrl: string;
  technologies: string[];
  category: string;
  date: string;
  status: "completed" | "in-progress" | "archived";
  featured: boolean;
}

interface Filter {
  id: string;
  label: string;
  icon: string;
}

// Composables
const { locale } = useI18n();

// State
const activeFilter = ref("all");
const loading = ref(false);
const displayCount = ref(6);

// Filters configuration
const filters: Filter[] = [
  { id: "all", label: "All Projects", icon: "i-heroicons-squares-2x2" },
  { id: "web", label: "Web Development", icon: "i-heroicons-globe-alt" },
  {
    id: "mobile",
    label: "Mobile Apps",
    icon: "i-heroicons-device-phone-mobile",
  },
  { id: "api", label: "API & Backend", icon: "i-heroicons-server" },
  { id: "ui", label: "UI/UX Design", icon: "i-heroicons-paint-brush" },
  {
    id: "tools",
    label: "Tools & Utilities",
    icon: "i-heroicons-wrench-screwdriver",
  },
];

// Use centralized personal data
const { projects } = usePersonalData();
const { project: projectFormatters, date: dateFormatters } =
  personalDataFormatters;

// Transform personal data to component format
const allProjects = computed(() => {
  return projects.value.map((project) => ({
    id: project.name.toLowerCase().replace(/\s+/g, "-"),
    title: project.name,
    description: project.description,
    image: project.image || "/images/projects/default.jpg",
    demoUrl: project.url || "#",
    githubUrl: project.github || "#",
    technologies: project.technologies,
    category: project.category || "web",
    date: project.startDate,
    status: project.status,
    featured: project.featured,
  }));
});

// Computed properties
const filteredProjects = computed(() => {
  let filtered = allProjects.value;

  if (activeFilter.value !== "all") {
    filtered = filtered.filter(
      (project) => project.category === activeFilter.value
    );
  }

  return filtered.slice(0, displayCount.value);
});

const hasMore = computed(() => {
  const totalFiltered =
    activeFilter.value === "all"
      ? allProjects.value.length
      : allProjects.value.filter((p) => p.category === activeFilter.value)
          .length;

  return displayCount.value < totalFiltered;
});

// Methods
const setActiveFilter = (filterId: string) => {
  activeFilter.value = filterId;
  displayCount.value = 6; // Reset display count when filter changes
};

const loadMore = async () => {
  loading.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  displayCount.value += 6;
  loading.value = false;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Lifecycle
onMounted(() => {
  // Could fetch projects from API here
  console.log("Projects showcase mounted");
});
</script>

<style scoped>
/* Transition animations for project cards */
.project-card-enter-active,
.project-card-leave-active {
  transition: all 0.3s ease;
}

.project-card-enter-from,
.project-card-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.project-card-move {
  transition: transform 0.3s ease;
}

/* RTL support for responsive design */
@media (max-width: 768px) {
  [dir="rtl"] .filter-buttons {
    flex-direction: column;
    align-items: center;
  }

  [dir="rtl"] .project-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
