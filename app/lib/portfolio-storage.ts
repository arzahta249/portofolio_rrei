import { Project, starterProjects } from "../data/portfolio";

export const PROJECT_STORAGE_KEY = "harum-projects";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function normalizeProject(project: Project, index = 0): Project {
  return {
    ...project,
    detail: project.detail || project.description,
    gallery: Array.isArray(project.gallery) ? project.gallery : [],
    videoUrl: project.videoUrl || "",
    featured: typeof project.featured === "boolean" ? project.featured : index < 4,
  };
}

export function normalizeProjects(projects: Project[]): Project[] {
  return projects.map(normalizeProject);
}

export function readProjects() {
  return normalizeProjects(readStorage(PROJECT_STORAGE_KEY, starterProjects));
}

export function saveProjects(projects: Project[]) {
  window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

export function getFeaturedProjects(projects: Project[]) {
  const featured = projects.filter((project) => project.featured).slice(0, 4);
  return featured.length > 0 ? featured : projects.slice(0, 4);
}
