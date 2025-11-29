<template>
  <main class="app">
    <h1>Laptops by brand</h1>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading">Loading...</p>

    <table v-if="!loading && items.length" class="data-table">
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
* {
  box-sizing: border-box;
}

.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #ffffff;
  color: #000000;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #000000;
}

.error {
  color: #000000;
  background-color: #f5f5f5;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table thead {
  background-color: #fafafa;
  border-bottom: 2px solid #e0e0e0;
}

.data-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000000;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.data-table th:hover {
  background-color: #f5f5f5;
}

.data-table th:not(:last-child) {
  border-right: 1px solid #e0e0e0;
}

.data-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.15s ease;
}

.data-table tbody tr:hover {
  background-color: #f9f9f9;
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: 1rem 1.5rem;
  font-size: 0.9375rem;
  color: #000000;
  border-right: 1px solid #e0e0e0;
}

.data-table td:last-child {
  border-right: none;
}

.data-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.data-table tbody tr:nth-child(even):hover {
  background-color: #f5f5f5;
}

.pagination {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.pagination button {
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #000000;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  font-size: 0.9375rem;
  color: #000000;
  font-weight: 500;
}
</style>
