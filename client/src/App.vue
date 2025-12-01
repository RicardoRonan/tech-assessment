<template>
  <div class="app-container">
    <main class="app">
      <header class="header">
        <h1>Laptops by brand</h1>
      </header>

      <div class="filters">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or category..."
            class="search-input"
            @input="handleSearchInput"
          />
        </div>
        <div class="category-filter-container">
          <select
            v-model="selectedCategory"
            class="category-select"
            @change="handleCategoryChange"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="loading" class="loading">Loading...</p>

      <div v-if="!loading && items.length" class="table-wrapper">
        <table class="data-table">
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
      </div>

      <p v-if="!loading && !items.length && !error" class="no-items">
        No items found.
      </p>

      <div class="pagination">
        <div class="pagination-info">
          <span v-if="totalPages">
            {{ ((currentPage - 1) * limit) + 1 }}-{{ Math.min(currentPage * limit, (currentPage - 1) * limit + items.length) }} of {{ totalPages * limit }}
          </span>
        </div>
        <div class="pagination-controls">
          <button @click="goToPrev" :disabled="!prevPage || loading" class="pagination-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="page-numbers">
            <button 
              v-for="page in Math.min(10, totalPages)" 
              :key="page"
              @click="fetchPage(page)"
              :class="['page-btn', { active: currentPage === page }]"
            >
              {{ page }}
            </button>
            <span v-if="totalPages > 10" class="page-ellipsis">...</span>
            <button 
              v-if="totalPages > 10"
              @click="fetchPage(totalPages)"
              :class="['page-btn', { active: currentPage === totalPages }]"
            >
              {{ totalPages }}
            </button>
          </div>
          <button @click="goToNext" :disabled="!nextPage || loading" class="pagination-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </main>
  </div>
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

const searchQuery = ref('');
const selectedCategory = ref('');
const debounceTimer = ref(null);

const categories = [
  'Apple',
  'Dell',
  'HP',
  'Lenovo',
  'ASUS',
  'Acer',
  'MSI',
  'Razer',
  'Samsung',
  'Microsoft',
  'Google',
  'Framework',
];

async function fetchPage(page = 1) {
  loading.value = true;
  error.value = '';
  items.value = [];

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchQuery.value && searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim());
    }

    if (selectedCategory.value && selectedCategory.value.trim()) {
      params.append('category', selectedCategory.value.trim());
    }

    const res = await fetch(`/api/items?${params.toString()}`);
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

function handleSearchInput() {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }

  debounceTimer.value = setTimeout(() => {
    currentPage.value = 1;
    fetchPage(1);
  }, 300);
}

function handleCategoryChange() {
  currentPage.value = 1;
  fetchPage(1);
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
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

.app-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  min-height: 100vh;
}

.header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #ffffff;
  color: #111827;
  transition: all 0.15s ease;
}

.search-input:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.category-filter-container {
  min-width: 180px;
}

.category-select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #ffffff;
  color: #111827;
  cursor: pointer;
  transition: all 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}

.category-select:focus {
  outline: none;
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
}

.category-select:hover {
  border-color: #d1d5db;
}

.error {
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.loading {
  color: #6b7280;
  padding: 1rem;
  text-align: center;
  font-size: 0.9375rem;
}

.no-items {
  color: #6b7280;
  padding: 2rem;
  text-align: center;
  font-size: 0.9375rem;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
}

.data-table thead {
  background-color: #fafafa;
}

.data-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.data-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.15s ease;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #111827;
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #6b7280;
  padding: 0;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.page-btn:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}

.page-btn.active {
  background-color: #111827;
  border-color: #111827;
  color: #ffffff;
}

.page-ellipsis {
  padding: 0 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .filters {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-container,
  .category-filter-container {
    min-width: 100%;
  }

  .table-wrapper {
    margin: 0 auto;
    width: calc(100% - 2rem);
  }

  .data-table {
    min-width: 600px;
    margin: 0 auto;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
  }

  .data-table th {
    font-size: 0.6875rem;
  }

  .pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-info {
    text-align: center;
    order: -1;
  }

  .pagination-controls {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .app {
    padding: 0.75rem;
  }

  h1 {
    font-size: 1.25rem;
  }

  .table-wrapper {
    margin: 0 auto;
    width: calc(100% - 1.5rem);
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .pagination-controls {
    flex-wrap: wrap;
  }
}
</style>
