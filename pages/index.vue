<template>
  <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-white shadow-lg">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-xl">V</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-900">{{ t('app.title') }}</h1>
              </div>
              <div class="flex items-center space-x-4">
                <!-- Desktop: Level and Pieces on same line -->
                <div class="hidden md:flex items-center space-x-4">
                  <div class="text-sm text-gray-600">
                    <span class="font-semibold">{{ t('ui.level') }}:</span> {{ t(`levels.${currentLevel}`) }}
                  </div>
                  <div class="text-sm text-gray-600">
                    <span class="font-semibold">{{ t('ui.pieces') }}:</span> {{ collectedPieces }}/{{ totalPieces }}
                  </div>
                </div>
                <!-- Mobile: Level and Pieces stacked -->
                <div class="md:hidden flex flex-col items-end space-y-1">
                  <div class="text-sm text-gray-600">
                    <span class="font-semibold">{{ t('ui.level') }}:</span> {{ t(`levels.${currentLevel}`) }}
                  </div>
                  <div class="text-sm text-gray-600">
                    <span class="font-semibold">{{ t('ui.pieces') }}:</span> {{ collectedPieces }}/{{ totalPieces }}
                  </div>
                </div>
                <!-- Reset Button -->
                <button 
                  @click="resetGame"
                  class="px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                  title="Reset Game"
                >
                  🔄 {{ t('app.reset') }}
                </button>
              </div>
            </div>
          </div>
        </header>

    <!-- Main Content -->
    <main class="flex-1 p-4">
      <div class="max-w-4xl mx-auto">
        <!-- Welcome Section -->
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🎮✨🎓</div>
          <h2 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 mb-4">
            {{ t('app.welcome') }}
          </h2>
          <p class="text-xl text-gray-700 mb-6 font-semibold">
            🧩 {{ t('app.subtitle') }} 🎯
          </p>
          <div class="text-2xl">🌟⭐💫</div>
        </div>

        <!-- Level Selection -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            v-for="level in levels" 
            :key="level.id"
            class="game-card level-card cursor-pointer"
            :class="{ 'ring-4 ring-pink-500 shadow-2xl': currentLevel === level.id }"
            @click="selectLevel(level.id)"
          >
            <div class="text-center">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                   :class="level.color">
                {{ level.icon }}
              </div>
              <h3 class="text-xl font-semibold mb-2">{{ t(`levels.${level.id}`) }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ t(`levels.${level.id}_desc`) }}</p>
              <div class="text-sm text-gray-500">
                {{ level.piecesRequired }} {{ t('levels.pieces_required') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Sector Categories -->
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            {{ t('sectors.select_sector') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="sector in sectors" 
              :key="sector.id"
              class="game-card sector-card cursor-pointer"
              @click="selectSector(sector.id)"
            >
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center text-2xl"
                     :class="sector.color">
                  {{ sector.icon }}
                </div>
                <h4 class="font-semibold text-lg mb-2">{{ sector.name }}</h4>
                <p class="text-sm text-gray-600 mb-4">{{ sector.description }}</p>
                <div class="text-xs text-gray-500">
                  {{ getSectorProgress(sector.id) }}/{{ getSectorTotalQuestions(sector.id) }} {{ t('sectors.subjects_count') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Puzzle Progress -->
        <div v-if="collectedPieces > 0" class="game-card">
          <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
            {{ t('game.puzzle_progress') }}
          </h3>
          <div class="flex flex-wrap justify-center gap-2">
            <div 
              v-for="i in totalPieces" 
              :key="i"
              class="w-12 h-12 rounded-lg border-2 flex items-center justify-center"
              :class="i <= collectedPieces ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-500' : 'bg-gray-200 border-gray-300'"
            >
              <span v-if="i <= collectedPieces" class="text-white font-bold text-lg">
                {{ i }}
              </span>
            </div>
          </div>
          <div class="text-center mt-4">
            <button 
              v-if="collectedPieces >= totalPieces"
              @click="startPuzzleAssembly"
              class="btn-primary"
            >
              {{ t('game.puzzle_start') }} 🧩
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestions } from '~/composables/useQuestions'
import { useI18n } from '#imports'
import { 
  DIFFICULTY_LEVELS, 
  DIFFICULTY_LABELS, 
  DIFFICULTY_DESCRIPTIONS, 
  DIFFICULTY_ICONS, 
  DIFFICULTY_COLORS, 
  DIFFICULTY_PIECES_REQUIRED 
} from '~/constants/difficulty'

// Game state
const currentLevel = ref<string>(DIFFICULTY_LEVELS.EASY)
const collectedPieces = ref(0)
const totalPieces = ref<number>(DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.EASY])

// Game levels
const levels = [
  {
    id: DIFFICULTY_LEVELS.EASY,
    name: DIFFICULTY_LABELS[DIFFICULTY_LEVELS.EASY],
    description: DIFFICULTY_DESCRIPTIONS[DIFFICULTY_LEVELS.EASY],
    icon: DIFFICULTY_ICONS[DIFFICULTY_LEVELS.EASY],
    color: DIFFICULTY_COLORS[DIFFICULTY_LEVELS.EASY],
    piecesRequired: DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.EASY]
  },
  {
    id: DIFFICULTY_LEVELS.MEDIUM,
    name: DIFFICULTY_LABELS[DIFFICULTY_LEVELS.MEDIUM],
    description: DIFFICULTY_DESCRIPTIONS[DIFFICULTY_LEVELS.MEDIUM],
    icon: DIFFICULTY_ICONS[DIFFICULTY_LEVELS.MEDIUM],
    color: DIFFICULTY_COLORS[DIFFICULTY_LEVELS.MEDIUM],
    piecesRequired: DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.MEDIUM]
  },
  {
    id: DIFFICULTY_LEVELS.HARD,
    name: DIFFICULTY_LABELS[DIFFICULTY_LEVELS.HARD],
    description: DIFFICULTY_DESCRIPTIONS[DIFFICULTY_LEVELS.HARD],
    icon: DIFFICULTY_ICONS[DIFFICULTY_LEVELS.HARD],
    color: DIFFICULTY_COLORS[DIFFICULTY_LEVELS.HARD],
    piecesRequired: DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.HARD]
  }
]

// Get sectors from question bank
const { getAllSectors } = useQuestions()
const sectors = getAllSectors()

// i18n
const { t } = useI18n()


// Game progress tracking
const gameProgress = ref<Record<string, any>>({})

// Load progress from localStorage using useAsyncData
const { data: savedProgress } = await useAsyncData(
  'game-progress',
  async () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vui-hoc-progress')
    }
    return null
  },
  {
    default: () => null,
    server: false
  }
)

// Update reactive values when data loads
watch(savedProgress, (progress) => {
  if (progress) {
    const parsed = JSON.parse(progress)
    gameProgress.value = parsed
    collectedPieces.value = parsed.collectedPieces || 0
    currentLevel.value = (parsed.currentLevel as string) || DIFFICULTY_LEVELS.EASY
  }
}, { immediate: true })

// Methods
const selectLevel = (levelId: string) => {
  currentLevel.value = levelId
  updateTotalPieces()
  saveProgress()
}

const updateTotalPieces = () => {
  totalPieces.value = DIFFICULTY_PIECES_REQUIRED[currentLevel.value as keyof typeof DIFFICULTY_PIECES_REQUIRED] || DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.EASY]
}

const getSectorProgress = (sectorId: string) => {
  return gameProgress.value[sectorId]?.completed || 0
}

const getSectorTotalQuestions = (sectorId: string) => {
  // Return different question counts based on level
  const baseQuestions = currentLevel.value === DIFFICULTY_LEVELS.EASY ? 3 : currentLevel.value === DIFFICULTY_LEVELS.MEDIUM ? 4 : 5
  return baseQuestions
}

const selectSector = (sectorId: string) => {
  navigateTo(`/sector/${sectorId}`)
}

const startPuzzleAssembly = () => {
  navigateTo('/puzzle')
}

const saveProgress = () => {
  gameProgress.value.collectedPieces = collectedPieces.value
  gameProgress.value.currentLevel = currentLevel.value
  localStorage.setItem('vui-hoc-progress', JSON.stringify(gameProgress.value))
}

const resetGame = () => {
  if (confirm(t('app.reset_confirm'))) {
    // Clear all progress
    gameProgress.value = {}
    collectedPieces.value = 0
    currentLevel.value = DIFFICULTY_LEVELS.EASY
    updateTotalPieces()
    
    // Clear localStorage
    localStorage.removeItem('vui-hoc-progress')
    
    // Refresh the page to reset everything
    window.location.reload()
  }
}

// Update total pieces when level changes
watch(currentLevel, updateTotalPieces)
</script>
