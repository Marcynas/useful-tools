import { ref, computed, onMounted, watch } from 'vue'
import Papa from 'papaparse'

export function useTools() {
  const tableData = ref([])
  const filteredTools = ref([])
  const searchQuery = ref('')
  const selectedTag = ref('all')
  const loading = ref(false)
  
  const tags = [
    "all", "free", "paid", "freemium", "software", "app", "website", 
    "vector art", "image editing", "digital painting", "pixel art", 
    "windows", "macos", "linux", "3d art", "video editing", "cad", 
    "font", "design", "animation", "ai", "resource", "web dev", "github"
  ]

  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyAYAuMz-YAen_9ZcuR61DIOKLseC_FTK6AQx-_NCXism02McCLOLW45q1pyMPtKlEKpuJAm0ET6Ch/pub?gid=0&single=true&output=csv"

  const CACHE_KEY = 'tools_csv_cache'
const CACHE_TIME = 60 * 60 * 1000 // 1 hour

const fetchSheet = async () => {
  loading.value = true
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_TIME) {
      tableData.value = data
      loading.value = false
      return
    }
  }
  try {
    const res = await fetch(sheetUrl)
    const csvText = await res.text()
    const parsed = Papa.parse(csvText, { header: true }).data
      .filter(r => r.Tool)
      .map(r => ({
        Category: r.Category?.trim() || 'Uncategorized',
        Tool: r.Tool?.trim(),
        Description: r.Description?.trim(),
        Link: r.Link?.trim(),
        Icon: r.Icon?.trim(),
        Tags: r.Tags?.trim()
      }))
    tableData.value = parsed
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: parsed, timestamp: Date.now() }))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

  onMounted(fetchSheet)

  const filterTools = () => {
    filteredTools.value = tableData.value.filter(tool => {
      const searchMatch = [tool.Tool, tool.Description].some(
        t => t?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      const tagMatch = selectedTag.value === 'all' || tool.Tags?.toLowerCase().includes(selectedTag.value.toLowerCase())
      return searchMatch && tagMatch
    })
  }

  watch([searchQuery, selectedTag, tableData], filterTools, { immediate: true })

  const groupedTools = computed(() => {
    return filteredTools.value.reduce((acc, t) => {
      const cat = t.Category || 'Uncategorized'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(t)
      return acc
    }, {})
  })

  return { filteredTools, groupedTools, searchQuery, selectedTag, tags, loading }
}