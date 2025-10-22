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
            <h1 class="text-xl font-bold text-gray-900">{{ subjectInfo?.name || t('app.loading') }}</h1>
            <div class="text-sm text-gray-600">{{ t('game.question') }} {{ currentQuestion + 1 }}/{{ questions?.length || 0 }}</div>
          </div>
          <div class="w-20"></div>
        </div>
      </div>
    </header>

    <!-- Game Content -->
    <main class="p-4">
      <div class="max-w-2xl mx-auto">
        <!-- Loading State -->
        <div v-if="status === 'pending'" class="question-card mb-6">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 animate-pulse"></div>
            <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('ui.loading_questions') }}</h2>
          </div>
        </div>

        <!-- Completed Subject Results -->
        <div v-else-if="isSubjectCompleted" class="question-card mb-6">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-2xl">
              ✅
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-4">
              {{ t('ui.completed') }}
            </h2>
            <p class="text-gray-600 mb-6">
              {{ t('game.score') }} {{ previousScore }}/{{ questions?.length || 0 }} {{ t('game.question') }}
            </p>
            <div class="mb-6">
              <div class="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl">
                🧩
              </div>
              <p class="text-sm font-semibold text-gray-700">
                {{ t('game.puzzle_piece') }}
              </p>
            </div>
            <div class="space-y-3">
              <button @click="restartSubject" class="btn-primary w-full">
                {{ t('app.play_again') }}
              </button>
              <button @click="goBack" class="btn-secondary w-full">
                {{ t('app.go_home') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Question Card -->
        <div v-else-if="!gameCompleted && currentQuestionData" class="question-card mb-6">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl transition-all duration-500"
                 :class="{
                   'animate-bounce': isProcessing,
                   'animate-pulse': showCorrectAnswer,
                   [subjectInfo?.color || 'bg-gray-100 text-gray-600']: !isProcessing && !showCorrectAnswer
                 }">
              {{ subjectInfo?.icon || '📚' }}
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-4 transition-all duration-300"
                :class="{ 'animate-pulse': isProcessing }">
              {{ currentQuestionData.question }}
            </h2>
            
            <!-- Processing indicator -->
            <div v-if="isProcessing" class="mb-4">
              <div class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('game.checking') }}
              </div>
            </div>
            
            <!-- Result feedback -->
            <div v-if="showCorrectAnswer" class="mb-4">
              <div class="inline-flex items-center px-4 py-2 rounded-full"
                   :class="selectedAnswer === currentQuestionData.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                <span class="text-2xl mr-2">
                  {{ selectedAnswer === currentQuestionData.correct ? '🎉' : '😔' }}
                </span>
                {{ selectedAnswer === currentQuestionData.correct ? t('game.correct') : t('game.incorrect') }}
              </div>
            </div>
          </div>

          <!-- Multiple Choice Options -->
          <div v-if="currentQuestionData && currentQuestionData.type === 'mcq'" class="space-y-3">
            <button 
              v-for="(option, index) in currentQuestionData.options" 
              :key="index"
              @click="selectAnswer(index)"
              class="w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform"
              :class="{
                'border-blue-500 bg-blue-50 scale-105 shadow-lg': selectedAnswer === index && !isProcessing,
                'border-green-500 bg-green-50': showCorrectAnswer && index === currentQuestionData.correct,
                'border-gray-200 bg-white hover:border-gray-300 hover:scale-105': selectedAnswer !== index && !isProcessing && !showCorrectAnswer,
                'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50': isProcessing || (showCorrectAnswer && index !== currentQuestionData.correct)
              }"
              :disabled="isProcessing"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300"
                     :class="{
                       'border-blue-500 bg-blue-500 text-white scale-110': selectedAnswer === index && !isProcessing,
                       'border-green-500 bg-green-500 text-white': showCorrectAnswer && index === currentQuestionData.correct,
                       'border-gray-300': selectedAnswer !== index && !showCorrectAnswer
                     }">
                  {{ String.fromCharCode(65 + index) }}
                </div>
                <span class="text-gray-900">{{ option }}</span>
              </div>
            </button>
          </div>

          <!-- True/False Options -->
          <div v-else-if="currentQuestionData && currentQuestionData.type === 'true-false'" class="space-y-3">
            <button 
              @click="selectAnswer(true)"
              class="w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform"
              :class="{
                'border-blue-500 bg-blue-50 scale-105 shadow-lg': selectedAnswer === true && !isProcessing,
                'border-green-500 bg-green-50': showCorrectAnswer && currentQuestionData.correct === true,
                'border-gray-200 bg-white hover:border-gray-300 hover:scale-105': selectedAnswer !== true && !isProcessing && !showCorrectAnswer,
                'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50': isProcessing || (showCorrectAnswer && currentQuestionData.correct !== true)
              }"
              :disabled="isProcessing"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300"
                     :class="{
                       'border-blue-500 bg-blue-500 text-white scale-110': selectedAnswer === true && !isProcessing,
                       'border-green-500 bg-green-500 text-white': showCorrectAnswer && currentQuestionData.correct === true,
                       'border-gray-300': selectedAnswer !== true && !showCorrectAnswer
                     }">
                  ✓
                </div>
                <span class="text-gray-900">{{ t('ui.true') }}</span>
              </div>
            </button>
            <button 
              @click="selectAnswer(false)"
              class="w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform"
              :class="{
                'border-blue-500 bg-blue-50 scale-105 shadow-lg': selectedAnswer === false && !isProcessing,
                'border-green-500 bg-green-50': showCorrectAnswer && currentQuestionData.correct === false,
                'border-gray-200 bg-white hover:border-gray-300 hover:scale-105': selectedAnswer !== false && !isProcessing && !showCorrectAnswer,
                'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50': isProcessing || (showCorrectAnswer && currentQuestionData.correct !== false)
              }"
              :disabled="isProcessing"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300"
                     :class="{
                       'border-blue-500 bg-blue-500 text-white scale-110': selectedAnswer === false && !isProcessing,
                       'border-green-500 bg-green-500 text-white': showCorrectAnswer && currentQuestionData.correct === false,
                       'border-gray-300': selectedAnswer !== false && !showCorrectAnswer
                     }">
                  ✗
                </div>
                <span class="text-gray-900">{{ t('ui.false') }}</span>
              </div>
            </button>
          </div>

          <!-- Submit Button -->
          <div class="mt-6 text-center">
            <button 
              @click="submitAnswer"
              :disabled="selectedAnswer === null || isProcessing"
              class="w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform"
              :class="{
                'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105': selectedAnswer !== null && !isProcessing,
                'bg-gray-400 text-gray-200 cursor-not-allowed': selectedAnswer === null || isProcessing
              }"
            >
              <span v-if="!isProcessing">{{ t('game.answer') }}</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('ui.processing') }}
              </span>
            </button>
          </div>
        </div>

        <!-- Game Completed -->
        <div v-else-if="gameCompleted" class="text-center">
          <div class="question-card">
            <!-- Success case: All answers correct -->
            <div v-if="correctAnswers === (questions?.length || 0)">
              <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-4xl">
                🎉
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                {{ t('game.congratulations') }}
              </h2>
            </div>
            <!-- Failure case: Not all answers correct -->
            <div v-else>
              <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-300 flex items-center justify-center text-4xl">
                😔
              </div>
            </div>
            <p class="text-gray-600 mb-6">
              {{ t('game.score') }} {{ correctAnswers }}/{{ questions?.length || 0 }} {{ t('game.question') }}
            </p>
            <div v-if="correctAnswers === (questions?.length || 0)" class="mb-6">
              <div v-if="!hasAlreadyReceivedReward" class="mb-6">
                <div class="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
                  🧩
                </div>
                <p class="text-lg font-semibold text-gray-900">
                  {{ t('game.puzzle_piece') }}
                </p>
              </div>
              <div v-else class="mb-6">
                <div class="w-16 h-16 mx-auto mb-4 rounded-lg bg-gray-300 flex items-center justify-center text-2xl">
                  ✅
                </div>
                <p class="text-lg font-semibold text-gray-600">
                  Bạn đã nhận mảnh ghép cho môn học này rồi!
                </p>
              </div>
            </div>
            <div v-else class="mb-6">
              <p class="text-lg font-semibold text-gray-600">
                Bạn cần trả lời đúng tất cả câu hỏi để nhận mảnh ghép!
              </p>
            </div>
            <div class="space-y-3">
              <button @click="playAgain" class="btn-primary w-full">
                {{ t('app.play_again') }}
              </button>
              <button @click="goBack" class="btn-secondary w-full">
                {{ t('app.go_home') }}
              </button>
            </div>
          </div>
        </div>

        <!-- No Questions Available -->
        <div v-else class="text-center">
          <div class="question-card">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
              ❌
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              {{ t('ui.loading_questions') }}
            </h2>
            <p class="text-gray-600 mb-6">
              Không có câu hỏi nào được tìm thấy cho môn học này.
            </p>
            <button @click="goBack" class="btn-secondary w-full">
              {{ t('app.go_home') }}
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="!isSubjectCompleted" class="mt-6">
          <div class="bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              :style="{ width: `${((currentQuestion + 1) / (questions?.length || 1)) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestions, type Question } from '~/composables/useQuestions'
import { DIFFICULTY_LEVELS, DIFFICULTY_QUESTION_COUNTS } from '~/constants/difficulty'
import { useI18n } from '#imports'

const route = useRoute()
const router = useRouter()

// Get sector from the path and subject from query parameter
const sectorId = route.params.subject as string
const subjectId = route.query.subject as string

// i18n
const { t } = useI18n()

// Game state
const currentQuestion = ref(0)
const selectedAnswer = ref(null)
const gameCompleted = ref(false)
const correctAnswers = ref(0)
const showResult = ref(false)
const isProcessing = ref(false)
const showCorrectAnswer = ref(false)
const isSubjectCompleted = ref(false)
const previousScore = ref(0)

// Get subject info from question bank
const { getSubjectInfo } = useQuestions()
const subjectInfo = getSubjectInfo(sectorId, subjectId)

// Get questions from the composable
const { getRandomQuestions, getQuestionsBySubject } = useQuestions()

// Get current level from localStorage
const currentLevel = ref(DIFFICULTY_LEVELS.EASY)

// Use useAsyncData to load questions with consistent selection
const { data: questions, status, error, refresh } = await useAsyncData(
  `questions-${sectorId}-${subjectId}`,
  async () => {
    // Check if we have stored questions for this subject
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('vui-hoc-progress')
      const progress = savedProgress ? JSON.parse(savedProgress) : {}
      const fullSubjectKey = `${sectorId}-${subjectId}`
      
      // Check if subject is already completed
      if (progress[fullSubjectKey]?.completed) {
        isSubjectCompleted.value = true
        previousScore.value = progress[fullSubjectKey].questionsCompleted || 0
        console.log('Subject already completed with score:', previousScore.value)
        return progress[fullSubjectKey].selectedQuestions || []
      }
      
      // If we have stored questions, use them
      if (progress[fullSubjectKey]?.selectedQuestions) {
        console.log('Using stored questions for', fullSubjectKey)
        return progress[fullSubjectKey].selectedQuestions
      }
    }
    
    // If no stored questions, get all available questions and randomly select 3
    const allQuestions = getQuestionsBySubject(sectorId, subjectId, currentLevel.value)
    const questionCount = 3 // Always use 3 questions
    const selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, questionCount)
    
    // Store the selected questions for consistency
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('vui-hoc-progress')
      const progress = savedProgress ? JSON.parse(savedProgress) : {}
      const fullSubjectKey = `${sectorId}-${subjectId}`
      
      if (!progress[fullSubjectKey]) {
        progress[fullSubjectKey] = { completed: false, pieces: 0, questionsCompleted: 0 }
      }
      
      progress[fullSubjectKey].selectedQuestions = selectedQuestions
      localStorage.setItem('vui-hoc-progress', JSON.stringify(progress))
      console.log('Stored new questions for', fullSubjectKey)
    }
    
    return selectedQuestions
  },
  {
    default: () => [],
    server: false
  }
)


const currentQuestionData = computed(() => questions.value?.[currentQuestion.value])

// Check if player has already received reward for this subject
const hasAlreadyReceivedReward = computed(() => {
  if (typeof window === 'undefined') return false
  
  const savedProgress = localStorage.getItem('vui-hoc-progress')
  const progress = savedProgress ? JSON.parse(savedProgress) : {}
  const fullSubjectKey = `${sectorId}-${subjectId}`
  
  return progress[fullSubjectKey]?.hasReceivedReward || false
})

// Methods
const selectAnswer = (answer: any) => {
  selectedAnswer.value = answer
}

const submitAnswer = () => {
  if (selectedAnswer.value === null || isProcessing.value) return

  isProcessing.value = true
  
  // Show processing animation for 1 second
  setTimeout(() => {
        const isCorrect = selectedAnswer.value === currentQuestionData.value?.correct
    console.log('Answer check:', { selected: selectedAnswer.value, correct: currentQuestionData.value?.correct, isCorrect })
    if (isCorrect) {
      correctAnswers.value++
      console.log('Correct answer! Total correct:', correctAnswers.value)
    } else {
      console.log('Wrong answer! Total correct:', correctAnswers.value)
    }
    
    // Update progress after each question
    updateProgress()
    
    // Show correct answer for 1.5 seconds
    showCorrectAnswer.value = true
    
    setTimeout(() => {
        if (currentQuestion.value < (questions.value?.length || 0) - 1) {
        // Move to next question
        currentQuestion.value++
        selectedAnswer.value = null
        showCorrectAnswer.value = false
        isProcessing.value = false
      } else {
        // Game completed - only award piece if all answers were correct AND haven't received reward before
        gameCompleted.value = true
        console.log('Game completed. Correct answers:', correctAnswers.value, 'Total questions:', questions.value?.length)
        if (correctAnswers.value === (questions.value?.length || 0)) {
          if (!hasAlreadyReceivedReward.value) {
            console.log('All answers correct - awarding puzzle piece')
            awardPuzzlePiece()
          } else {
            console.log('All answers correct but already received reward - no new puzzle piece')
          }
        } else {
          console.log('Not all answers correct - no puzzle piece')
        }
      }
    }, 1500)
  }, 1000)
}

const updateProgress = () => {
  // Update progress after each question
  if (typeof window !== 'undefined') {
    const savedProgress = localStorage.getItem('vui-hoc-progress')
    const progress = savedProgress ? JSON.parse(savedProgress) : {}
    
    const fullSubjectKey = `${sectorId}-${subjectId}`
    if (!progress[fullSubjectKey]) {
      progress[fullSubjectKey] = { completed: false, pieces: 0, questionsCompleted: 0 }
    }
    
    // Update questions completed count
    progress[fullSubjectKey].questionsCompleted = currentQuestion.value + 1
    
    localStorage.setItem('vui-hoc-progress', JSON.stringify(progress))
    console.log('Progress updated:', progress[fullSubjectKey].questionsCompleted, 'questions completed')
  }
}

const awardPuzzlePiece = () => {
  // Update localStorage with new puzzle piece
  if (typeof window !== 'undefined') {
    const savedProgress = localStorage.getItem('vui-hoc-progress')
    const progress = savedProgress ? JSON.parse(savedProgress) : {}
    
    // Mark this subject as completed
    const fullSubjectKey = `${sectorId}-${subjectId}`
    if (!progress[fullSubjectKey]) {
      progress[fullSubjectKey] = { completed: false, pieces: 0, questionsCompleted: 0, hasReceivedReward: false }
    }
    
    // Double-check: Only award piece if they haven't received a reward for this subject before
    if (!progress[fullSubjectKey].hasReceivedReward) {
      progress[fullSubjectKey].completed = true
      progress[fullSubjectKey].pieces = (progress[fullSubjectKey].pieces || 0) + 1
      progress[fullSubjectKey].hasReceivedReward = true
      progress.collectedPieces = (progress.collectedPieces || 0) + 1
      
      localStorage.setItem('vui-hoc-progress', JSON.stringify(progress))
      console.log('Puzzle piece awarded! Total pieces:', progress.collectedPieces)
      return true // Successfully awarded
    } else {
      console.log('No puzzle piece awarded - already received reward for this subject')
      return false // No piece awarded
    }
  }
  return false
}

const playAgain = async () => {
  currentQuestion.value = 0
  selectedAnswer.value = null
  gameCompleted.value = false
  correctAnswers.value = 0
  showResult.value = false
  isProcessing.value = false
  showCorrectAnswer.value = false
  // Don't refresh questions - keep the same questions for consistency
}

const restartSubject = async () => {
  // Clear the completed status and restart the game (but keep hasReceivedReward flag)
  if (typeof window !== 'undefined') {
    const savedProgress = localStorage.getItem('vui-hoc-progress')
    const progress = savedProgress ? JSON.parse(savedProgress) : {}
    const fullSubjectKey = `${sectorId}-${subjectId}`
    
    if (progress[fullSubjectKey]) {
      progress[fullSubjectKey].completed = false
      progress[fullSubjectKey].questionsCompleted = 0
      // Keep hasReceivedReward flag - don't reset it
      localStorage.setItem('vui-hoc-progress', JSON.stringify(progress))
    }
  }
  
  // Reset game state
  isSubjectCompleted.value = false
  previousScore.value = 0
  currentQuestion.value = 0
  selectedAnswer.value = null
  gameCompleted.value = false
  correctAnswers.value = 0
  showResult.value = false
  isProcessing.value = false
  showCorrectAnswer.value = false
}

const goBack = () => {
  router.push('/')
}
</script>
