<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <header class="mb-6 text-center">
      <h1 class="text-4xl font-bold mb-2">Various Useful Tools</h1>
      <p class="text-gray-600 mb-4">A curated list of tools to make your life easier.</p>
      <div class="flex justify-center space-x-4 flex-wrap">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tools..."
          class="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select v-model="selectedTag" class="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
    </header>

    <main>
      <div v-for="(tools, category) in groupedTools" :key="category" class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">{{ category }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          <ToolCard
            v-for="tool in tools"
            :key="tool.Tool"
            :tool="tool"
            :activeTag="selectedTag"
            @tag-selected="selectedTag = $event"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import ToolCard from './components/ToolCard.vue'
import { useTools } from './tools/useTools.js'

const { filteredTools, groupedTools, searchQuery, selectedTag, tags } = useTools()
</script>
