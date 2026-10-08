<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const article = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const isMarkedAsRead = ref(false)
const progressError = ref('')

onMounted(async () => {
  try {
    const response = await api.get(`/articles/${route.params.slug}`)
    article.value = response.data
  } catch (error) {
    errorMessage.value = 'This article could not be loaded.'
  } finally {
    isLoading.value = false
  }
})

async function markArticleAsRead() {
  if (!article.value) return

  progressError.value = ''

  try {
    await api.post(`/articles/${article.value.id}/progress`)
    isMarkedAsRead.value = true
  } catch (error) {
    progressError.value = 'The article could not be marked as read.'
  }
}
</script>

<template>
  <main class="article-page">
    <p v-if="isLoading" class="state-message">Loading article...</p>
    <p v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</p>
    <template v-else-if="article">
      <header class="article-header">
        <RouterLink :to="{ name: 'Articles' }" class="back-link">
          ← ALL ARTICLES
        </RouterLink>
        <p class="article-label">{{ article.category.replace('_', ' ') }}</p>
        <h1>{{ article.title }}</h1>
        <h2>{{ article.summary }}</h2>
        <p class="article-meta">
          {{ article.read_time_minutes }} MIN READ · UPDATED
          {{ new Date(article.updated_at).toLocaleDateString() }} · BY
          {{ article.author_username }}
        </p>
      </header>

      <section class="article-layout">
        <article class="article-details">
          <img
            :src="article.cover_image_url || '/logo.png'"
            :alt="article.title"
            class="article-hero"
          />
          <div class="article-content">
            <p>{{ article.content }}</p>

            <button
              type="button"
              class="mark-read"
              :class="{ completed: isMarkedAsRead }"
              :disabled="isMarkedAsRead"
              @click="markArticleAsRead"
            >
              {{ isMarkedAsRead ? '✓ READ' : '✓ MARK AS READ' }}
            </button>
            <p v-if="progressError" class="progress-error">{{ progressError }}</p>
          </div>
        </article>

        <aside class="article-sidebar">
          <section class="sidebar-card">
            <h3>YOUR READING</h3>
            <div class="progress-bar"><span></span></div>
            <strong>0% read</strong>
            <p>{{ article.read_time_minutes }} min article</p>
          </section>

          <section class="sidebar-card">
            <h3>ARTICLE INFO</h3>
            <p>{{ article.category.replace('_', ' ') }}</p>
            <p>{{ article.read_time_minutes }} min read</p>
          </section>
        </aside>
      </section>
    </template>
  </main>
</template>

<style scoped>
.article-page {
  min-height: 100vh;
  padding-bottom: 5rem;
  background: #fff;
  color: #111;
}

.article-header {
  padding: 2.5rem clamp(1.5rem, 9vw, 7rem) 3rem;
  border: 2px solid #111;
  background: #fff4e2;
}

.back-link {
  color: #111;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: underline;
}

.article-label {
  width: fit-content;
  margin: 1.5rem 0 0.75rem;
  padding: 0.35rem 1.1rem;
  background: #111;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  max-width: 1100px;
  margin: 0;
  font-family: Dummies, Georgia, serif;
  font-size: clamp(2rem, 30vw, 3rem);
  line-height: 0.95;
  text-transform: uppercase;
}

h2 {
  max-width: 720px;
  margin: 1.5rem 0 1rem;
  font-size: 1rem;
  line-height: 1.5;
}

.article-meta {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  gap: 2rem;
  max-width: 980px;
  margin: 2rem auto 0;
  padding: 0 1.5rem;
}

.article-details {
  min-width: 0;
}

.article-hero {
  display: block;
  width: 100%;
  max-height: 440px;
  border: 1.5px solid #111;
  border-radius: 1rem;
  object-fit: cover;
}

.article-content {
  padding: 2rem 0;
  font-size: 1rem;
  line-height: 1.8;
  white-space: pre-line;
}

.article-content p {
  margin: 0;
}

.mark-read {
  margin-top: 1rem;
  padding: 0.9rem 1.2rem;
  border: 2px solid #111;
  background: #ffed00;
  color: #111;
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
}

.mark-read:hover {
  background: #111;
  color: #ffed00;
}

.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-card {
  padding: 1rem;
  border: 1.5px solid #111;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.sidebar-card h3 {
  margin: 0 0 0.8rem;
  font-size: 0.7rem;
}

.sidebar-card p {
  margin: 0.5rem 0 0;
  text-transform: uppercase;
}

.progress-bar {
  height: 0.55rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
  border: 1px solid #111;
  border-radius: 999px;
}

.progress-bar span {
  display: block;
  width: 4%;
  height: 100%;
  background: #1685e5;
}

.state-message {
  padding: 3rem;
}

.state-message.error {
  color: #b34736;
}

@media (max-width: 700px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .article-sidebar {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .article-sidebar {
    grid-template-columns: 1fr;
  }
}
</style>
