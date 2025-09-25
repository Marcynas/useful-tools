<template>
  <div class="relative bg-white rounded-2xl shadow-md border overflow-hidden flex flex-col min-h-[300px]">
    <div class="p-4 flex flex-col flex-1">
      <div class="w-24 h-24 mb-2 flex items-center justify-center rounded-full bg-gray-900 p-2">
        <img :src="iconSrc" alt="tool icon" class="object-contain max-w-full max-h-full rounded-full" />
      </div>

      <h3 class="text-lg font-semibold mb-2">{{ tool.Tool }}</h3>
      <p class="text-gray-700 text-sm mb-2">
        {{ truncatedDescription }}
        <span v-if="tool.Description.length > 200" class="text-blue-500 cursor-pointer ml-1" @click="isExpanded = true">... Read more</span>
      </p>

      <a :href="tool.Link" target="_blank" class="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm inline-block mb-3 hover:bg-blue-600 w-max">
        Visit website
      </a>

      <div class="flex space-x-2 overflow-x-auto py-1">
        <button
          v-for="tag in tagsArray"
          :key="tag"
          @click="$emit('tag-selected', tag)"
          :class="[getTagClass(tag), 'px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 cursor-pointer hover:opacity-80', tag === activeTag ? 'animate-pulse' : '']"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <div v-if="isExpanded" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4" @click.self="isExpanded = false">
      <div class="bg-white rounded-2xl shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto p-6 relative">
        <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-bold" @click="isExpanded = false">×</button>
        <h3 class="text-xl font-semibold mb-4">{{ tool.Tool }}</h3>
        <p class="text-gray-700 mb-4">{{ tool.Description }}</p>
        <a :href="tool.Link" target="_blank" class="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm inline-block hover:bg-blue-600">Visit website</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getTagClass } from '../utils/tagUtils'

const props = defineProps({
  tool: Object,
  activeTag: String
})

const isExpanded = ref(false)
const truncatedDescription = computed(() => props.tool.Description?.slice(0, 200) || '')
const iconSrc = computed(() => props.tool.Icon ? `/usefull-tools/icons/${props.tool.Icon}` : '/icons/defaultIcon.svg')
const tagsArray = computed(() => props.tool.Tags?.split(',').map(t => t.trim()) || [])
</script>
