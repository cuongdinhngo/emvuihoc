<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="bg-white shadow-lg">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <button @click="goBack" class="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span>{{ t('app.back') }}</span>
          </button>
          <div class="text-center">
            <h1 class="text-xl font-bold text-gray-900">{{ sectorInfo?.name || t('app.loading') }}</h1>
            <div class="text-sm text-gray-600">{{ t('sectors.select_subject') }}</div>
          </div>
          <div class="w-20"></div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-4">
      <div class="max-w-4xl mx-auto">
        <!-- Sector Description -->
        <div v-if="sectorInfo" class="game-card mb-6">
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 rounded-lg flex items-center justify-center text-3xl"
                 :class="sectorInfo.color">
              {{ sectorInfo.icon }}
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ sectorInfo.name }}</h2>
            <p class="text-gray-600 mb-4">{{ sectorInfo.description }}</p>
          </div>
        </div>

        <!-- Subject Selection -->
        <div v-if="subjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="subject in subjects" 
            :key="subject.id"
            class="game-card subject-card cursor-pointer"
            :class="{ 'border-green-400 bg-green-50': isSubjectCompleted(subject.id) }"
            @click="selectSubject(subject.id)"
          >
            <div class="text-center">
              <div class="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-xl"
                   :class="subject.color">
                {{ subject.icon }}
              </div>
              <h4 class="font-semibold text-sm">{{ subject.name }}</h4>
              <div class="text-xs text-gray-500 mt-1">
                <div v-if="isSubjectCompleted(subject.id)" class="text-green-600 font-semibold">
                  ✅ {{ t('ui.completed') }}
                </div>
                <div v-else>
                  {{ getSubjectProgress(subject.id) }}/{{ getTotalQuestions(subject.id) }} {{ t('subjects.questions_count') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="game-card text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 animate-pulse"></div>
          <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('ui.loading_subjects') }}</h2>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestions } from '~/composables/useQuestions'
import { useI18n } from '#imports'
import { DIFFICULTY_LEVELS, DIFFICULTY_QUESTION_COUNTS } from '~/constants/difficulty'

const route = useRoute()
const router = useRouter()
const sectorId = route.params.sector as string

// i18n
const { t } = useI18n()

// Get sector and subjects info
const { getSectorInfo, getAllSubjects } = useQuestions()
const sectorInfo = getSectorInfo(sectorId)
const subjects = getAllSubjects(sectorId)

// Game progress tracking
const gameProgress = ref<Record<string, any>>({})
const currentLevel = ref(DIFFICULTY_LEVELS.EASY)

// Load progress from localStorage using useAsyncData
const { data: savedProgress } = await useAsyncData(
  'sector-progress',
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
    currentLevel.value = parsed.currentLevel || DIFFICULTY_LEVELS.EASY
  }
}, { immediate: true })

// Methods
const selectSubject = (subjectId: string) => {
  router.push(`/game/${sectorId}?subject=${subjectId}`)
}

const getSubjectProgress = (subjectId: string) => {
  return gameProgress.value[`${sectorId}-${subjectId}`]?.questionsCompleted || 0
}

const getTotalQuestions = (subjectId: string) => {
  // Return different question counts based on level
  return DIFFICULTY_QUESTION_COUNTS[currentLevel.value as keyof typeof DIFFICULTY_QUESTION_COUNTS] || DIFFICULTY_QUESTION_COUNTS[DIFFICULTY_LEVELS.EASY]
}

const isSubjectCompleted = (subjectId: string) => {
  return gameProgress.value[`${sectorId}-${subjectId}`]?.completed || false
}

const goBack = () => {
  router.push('/')
}
</script>
