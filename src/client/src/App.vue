<template>
  <main class="app">
    <h1>Items</h1>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading">Loading...</p>

    <table v-if="!loading && items.length" border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>{{ formatDate(item.created_at) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && !items.length && !error">
      No items found.
    </p>

    <div class="pagination">
      <button @click="goToPrev" :disabled="!prevPage || loading">
        Previous
      </button>

      <span v-if="totalPages">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button @click="goToNext" :disabled="!nextPage || loading">
        Next
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const items = ref([]);
const loading = ref(false);
const error = ref('');

const currentPage = ref(1);
const totalPages = ref(1);
const nextPage = ref(null);
const prevPage = ref(null);

const limit = 10;

async function fetchPage(page = 1) {
  loading.value = true;
  error.value = '';
  items.value = [];

  try {
    const res = await fetch(`/api/items?page=${page}&limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();

    items.value = data.items || [];
    currentPage.value = data.currentPage;
    totalPages.value = data.totalPages;
    nextPage.value = data.nextPage;
    prevPage.value = data.prevPage;
  } catch (err) {
    error.value = err.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
}

function goToNext() {
  if (nextPage.value) {
    fetchPage(nextPage.value);
  }
}

function goToPrev() {
  if (prevPage.value) {
    fetchPage(prevPage.value);
  }
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString();
}

onMounted(() => {
  fetchPage(1);
});
</script>

<style>
/* Replace this with your own styling */
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.error {
  color: red;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
