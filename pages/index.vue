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
            <div class="text-sm text-gray-600">
              <span class="font-semibold">{{ t('ui.level') }}:</span> {{ currentLevel }}
            </div>
            <div class="text-sm text-gray-600">
              <span class="font-semibold">{{ t('ui.pieces') }}:</span> {{ collectedPieces }}/{{ totalPieces }}
            </div>
            <!-- Language Switcher -->
            <div class="flex items-center space-x-2">
              <button 
                @click="switchLanguage('vi')"
                class="px-2 py-1 text-xs rounded"
                :class="locale === 'vi' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
              >
                VI
              </button>
              <button 
                @click="switchLanguage('en')"
                class="px-2 py-1 text-xs rounded"
                :class="locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'"
              >
                EN
              </button>
            </div>
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
              <h3 class="text-xl font-semibold mb-2">{{ t(`levels.${level.id === 'dễ' ? 'easy' : level.id === 'trung bình' ? 'medium' : 'hard'}`) }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ t(`levels.${level.id === 'dễ' ? 'easy' : level.id === 'trung bình' ? 'medium' : 'hard'}_desc`) }}</p>
              <div class="text-sm text-gray-500">
                {{ level.piecesRequired }} {{ t('levels.pieces_required') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Subject Categories -->
        <div class="mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            {{ t('subjects.select_subject') }}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div 
              v-for="subject in subjects" 
              :key="subject.id"
              class="game-card subject-card cursor-pointer"
              @click="startGame(subject.id)"
            >
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-xl"
                     :class="subject.color">
                  {{ subject.icon }}
                </div>
                <h4 class="font-semibold text-sm">{{ subject.name }}</h4>
                <div class="text-xs text-gray-500 mt-1">
                  {{ getSubjectProgress(subject.id) }}/{{ getTotalQuestions(subject.id) }} {{ t('subjects.questions_count') }}
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
          <div class="grid grid-cols-4 md:grid-cols-8 gap-2">
            <div 
              v-for="i in totalPieces" 
              :key="i"
              class="aspect-square rounded-lg border-2 flex items-center justify-center"
              :class="i <= collectedPieces ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-500' : 'bg-gray-200 border-gray-300'"
            >
              <span v-if="i <= collectedPieces" class="text-white font-bold text-sm">
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
// Game state
const currentLevel = ref('dễ')
const collectedPieces = ref(0)
const totalPieces = ref(12) // 4 pieces per subject × 3 subjects for easy level

// Game levels
const levels = [
  {
    id: 'dễ',
    name: 'Dễ',
    description: 'Câu hỏi cơ bản',
    icon: '🌟',
    color: 'bg-green-100 text-green-600',
    piecesRequired: 12
  },
  {
    id: 'trung bình',
    name: 'Trung bình',
    description: 'Câu hỏi nâng cao',
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-600',
    piecesRequired: 15
  },
  {
    id: 'khó',
    name: 'Khó',
    description: 'Câu hỏi thử thách',
    icon: '💎',
    color: 'bg-red-100 text-red-600',
    piecesRequired: 18
  }
]

// Get subjects from question bank
const { getAllSubjects } = useQuestions()
const subjects = getAllSubjects()

// i18n
const { locale, t, setLocale } = useI18n()

const switchLanguage = (lang: string) => {
  setLocale(lang)
}


// Game progress tracking
const gameProgress = ref({})

// Load progress from localStorage
onMounted(() => {
  const savedProgress = localStorage.getItem('vui-hoc-progress')
  if (savedProgress) {
    gameProgress.value = JSON.parse(savedProgress)
    collectedPieces.value = gameProgress.value.collectedPieces || 0
    currentLevel.value = gameProgress.value.currentLevel || 'dễ'
  }
})

// Methods
const selectLevel = (levelId: string) => {
  currentLevel.value = levelId
  updateTotalPieces()
  saveProgress()
}

const updateTotalPieces = () => {
  const level = levels.find(l => l.id === currentLevel.value)
  totalPieces.value = level?.piecesRequired || 12
}

const getSubjectProgress = (subjectId: string) => {
  return gameProgress.value[subjectId]?.completed || 0
}

const getTotalQuestions = (subjectId: string) => {
  // Return different question counts based on level
  const baseQuestions = currentLevel.value === 'dễ' ? 3 : currentLevel.value === 'trung bình' ? 4 : 5
  return baseQuestions
}

const startGame = (subjectId: string) => {
  navigateTo(`/game/${subjectId}`)
}

const startPuzzleAssembly = () => {
  navigateTo('/puzzle')
}

const saveProgress = () => {
  gameProgress.value.collectedPieces = collectedPieces.value
  gameProgress.value.currentLevel = currentLevel.value
  localStorage.setItem('vui-hoc-progress', JSON.stringify(gameProgress.value))
}

// Update total pieces when level changes
watch(currentLevel, updateTotalPieces)
</script>
