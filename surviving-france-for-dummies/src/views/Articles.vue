<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const selectedCategory = ref('all')
const articles = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const categories = [
  { value: 'all', label: 'All' },
  { value: 'everyday_life', label: 'Everyday Life' },
  { value: 'paperwork', label: 'Paperwork' },
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'culture', label: 'Culture' },
]

const categoryLabels = Object.fromEntries(
  categories.map((category) => [category.value, category.label]),
)

const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') return articles.value

  return articles.value.filter(
    (article) => article.category === selectedCategory.value
  )
})

onMounted(async () => {
  try {
    const response = await api.get('/articles')
    articles.value = response.data
  } catch (error) {
    errorMessage.value = 'Articles could not be loaded right now.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="articles-page">
    <header class="articles-header">
      <h1>Articles</h1>
      <p class="intro">Short, practical guides to the French way of life. Pick a topic or start with the must-read.</p>
    </header>

    <nav class="article-tabs" aria-label="Article categories">
      <button
        v-for="category in categories"
        :key="category.value"
        type="button"
        :class="{ active: selectedCategory === category.value }"
        @click="selectedCategory = category.value"
      >
        {{ category.label }}
      </button>
    </nav>

    <p v-if="isLoading" class="state-message">Loading articles...</p>
    <p v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</p>
    <p v-else-if="filteredArticles.length === 0" class="state-message">No published articles in this category yet.</p>

    <section v-else class="article-grid" aria-label="Articles">
      <article v-for="article in filteredArticles" :key="article.id" class="article-card">
        <img
          :src="article.cover_image_url || '/logo.png'"
          :alt="article.title"
          class="article-image"
        />
        <div class="article-content">
          <p class="article-category">{{ categoryLabels[article.category] }}</p>
          <h2>{{ article.title }}</h2>
          <p class="article-description">{{ article.summary }}</p>
          <p class="read-time">{{ article.read_time_minutes }} min read</p>
          <button type="button" class="discover-button">Discover <span aria-hidden="true">-&gt;</span></button>
        </div>
      </article>
    </section>
  </main>

</template>

<style scoped>
main {
    background-color: #ffff;
}

header {
    background-color: #FFF4E2 ;
    width: 100%;
    margin : 0;
}

.articles-page {
  --page-gutter: clamp(1rem, 4vw, 4rem);
  width: 100%;
  min-height: 100vh;
  padding: 0 var(--page-gutter) 5rem;
}

.articles-header {
  width: calc(100% + var(--page-gutter) + var(--page-gutter));
  margin-left: calc(0px - var(--page-gutter));
  padding: 2rem var(--page-gutter);
  box-sizing: border-box;
  margin-bottom: 0rem;
}

.eyebrow,
.article-category {
  color: #d85b45;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0.35rem 0 0.75rem;
  color: #213547;
  font-family: Dummies, Georgia, serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1;
}



.intro {
  color: #5d6870;
  font-size: 0.9rem;
}

.article-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.article-tabs button {
  flex: 0 0 auto;
  border: 1px solid #d9d5ca;
  border-radius: 999px;
  background: transparent;
  color: #53616a;
  cursor: pointer;
  padding: 0.6rem 1rem;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.article-tabs button:hover,
.article-tabs button.active {
  border-color: #213547;
  background: #213547;
  color: #fff;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.article-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e3dfd5;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(33, 53, 71, 0.08);
}

.article-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.article-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.25rem;
}

.article-content h2 {
  margin: 0.45rem 0 0.65rem;
  color: #213547;
  font-family: Dummies, Georgia, serif;
  font-size: 1.6rem;
  line-height: 1.1;
}

.article-description,
.read-time {
  color: #65727a;
  font-size: 0.95rem;
}

.read-time {
  margin-top: 0.8rem;
  font-size: 0.8rem;
}

.discover-button {
  margin-top: auto;
  padding: 1.25rem 0 0;
  border: 0;
  background: transparent;
  color: #d85b45;
  cursor: pointer;
  font-weight: 700;
}

.discover-button:hover {
  color: #a94332;
}

.state-message {
  color: #65727a;
  padding: 2rem 0;
}

.state-message.error {
  color: #b34736;
}

@media (max-width: 600px) {
  .articles-page {
    padding-top: 0;
  }
}
</style>
