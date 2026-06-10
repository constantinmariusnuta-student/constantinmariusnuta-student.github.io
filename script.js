const username = "constantinmariusnuta-student";

const container = document.getElementById("projects-container");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("error-message");

const searchInput = document.getElementById("search-input");

const languageFilter = document.getElementById("language-filter");

const sortSelect = document.getElementById("sort-select");
const loadMoreBtn = document.getElementById("load-more-btn");

const PAGE_SIZE = 6;

let allProjects = [];
let currentFiltered = [];
let currentIndex = 0;

function sortProjectsArray(projects) {
  const sortBy = (sortSelect && sortSelect.value) || "updated";
  return [...projects].sort((a, b) => {
    if (sortBy === "stars") {
      return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    }
    const aDate = a.updated_at ? new Date(a.updated_at) : new Date(0);
    const bDate = b.updated_at ? new Date(b.updated_at) : new Date(0);
    return bDate - aDate;
  });
}

async function loadProjects() {
  loading.classList.remove("hidden");
  errorMessage.textContent = "";
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!response.ok) {
      throw new Error("GitHub API error");
    }
    const repos = await response.json();
    const filteredRepos = repos.filter(repo => repo.fork === false);
    if (filteredRepos.length < 5) {
      loadFallbackProjects();
      return;
    }
    const sorted = sortProjectsArray(filteredRepos);
    allProjects = sorted;
    populateLanguages(sorted);
    renderInitialList(sorted);
  } catch (error) {
    console.log(error);
    errorMessage.textContent = "Ups! Nu am putut încărca proiectele momentan.";
    loadFallbackProjects();
  } finally {
    loading.classList.add("hidden");
  }
}

function appendProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <h3>${project.name}</h3>
    <p>
      ${project.description || "Fără descriere disponibilă"}
    </p>
    <p>
      <strong>Language:</strong>
      ${project.language || "Necunoscut"}
    </p>
    <p>⭐ ${project.stargazers_count || 0}</p>
    <p>🍴 ${project.forks_count || 0}</p>
    <a href="${project.html_url}" target="_blank">
      Vezi proiect
    </a>
  `;
  container.appendChild(card);
}

function renderInitialList(list) {
  container.innerHTML = "";
  currentFiltered = list;
  currentIndex = 0;
  if (!list || list.length === 0) {
    container.innerHTML = `<p>Nu există proiecte.</p>`;
    if (loadMoreBtn) loadMoreBtn.classList.add("hidden");
    return;
  }
  renderNextPage();
}

function renderNextPage() {
  const nextSlice = currentFiltered.slice(currentIndex, currentIndex + PAGE_SIZE);
  nextSlice.forEach(project => appendProjectCard(project));
  currentIndex += nextSlice.length;
  if (!loadMoreBtn) return;
  if (currentIndex >= currentFiltered.length) {
    loadMoreBtn.classList.add("hidden");
  } else {
    loadMoreBtn.classList.remove("hidden");
  }
}

function populateLanguages(projects) {
  const languages = [
    ...new Set(
      projects
        .map(project => project.language)
        .filter(Boolean)
    )
  ];
  languageFilter.innerHTML = '<option value="all">Toate limbajele</option>';
  languages.forEach(language => {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;
    languageFilter.appendChild(option);
  });
}

function filterProjects() {
  const searchText = searchInput.value.toLowerCase();
  const selectedLanguage = languageFilter.value;
  const filtered = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchText);
    const matchesLanguage = selectedLanguage === "all" || project.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });
  const sortedFiltered = sortProjectsArray(filtered);
  renderInitialList(sortedFiltered);
}

searchInput.addEventListener("input", filterProjects);
languageFilter.addEventListener("change", filterProjects);
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    filterProjects();
  });
}
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", renderNextPage);
}

async function loadFallbackProjects() {
  const response = await fetch("./data/fallback-projects.json");
  const projects = await response.json();
  projects.forEach(p => {
    if (p.fork === undefined) p.fork = false;
    if (!p.updated_at) p.updated_at = new Date().toISOString();
    if (!p.stargazers_count) p.stargazers_count = 0;
    if (!p.forks_count) p.forks_count = 0;
  });
  const nonForks = projects.filter(p => p.fork === false);
  const sorted = sortProjectsArray(nonForks);
  allProjects = sorted;
  populateLanguages(sorted);
  renderInitialList(sorted);
}

loadProjects();