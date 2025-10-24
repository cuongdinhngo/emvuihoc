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
            <span class="hidden sm:inline">{{ t('app.back') }}</span>
          </button>
              <div class="text-center">
                <h1 class="text-xl font-bold text-gray-900">{{ t('puzzle.title') }}</h1>
                <div class="text-sm text-gray-600">{{ placedPieces }}/{{ totalPieces }} {{ t('game.pieces_collected') }}</div>
              </div>
              <button 
                @click="resetGame"
                class="px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                title="Reset Game"
              >
                🔄 {{ t('app.reset') }}
              </button>
            </div>
          </div>
        </header>

    <!-- Puzzle Assembly Area -->
    <main class="p-4">
      <div class="max-w-4xl mx-auto">
        <!-- Instructions -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            {{ t('puzzle.instructions') }} 🧩
          </h2>
          <p class="text-gray-600">
            {{ t('puzzle.drag_drop') }}
          </p>
        </div>

        <!-- Puzzle Grid -->
        <div class="game-card mb-6">
          <div class="text-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('puzzle.instructions') }}</h3>
            <p class="text-sm text-gray-600">{{ t('puzzle.drag_drop') }}</p>
          </div>
          
          <!-- Puzzle Board -->
          <div class="puzzle-container mb-6 mx-auto" :style="puzzleContainerStyle">
            <!-- Full background image -->
            <div class="puzzle-background w-full h-full relative" :style="puzzleBackgroundStyle">
              <!-- Hover areas for each piece -->
              <div 
                v-for="(slot, index) in puzzleSlots" 
                :key="index"
                class="puzzle-hover-area absolute"
                :class="{
                  'puzzle-hover-correct': slot.piece && isCorrectPosition(slot.piece, index),
                  'puzzle-hover-wrong': slot.piece && !isCorrectPosition(slot.piece, index),
                  'puzzle-hover-empty': !slot.piece
                }"
                :style="getHoverAreaStyle(index)"
                @drop="dropPiece($event, index)"
                @dragover.prevent
                @dragenter.prevent
              >
                <!-- Show piece number in empty slots -->
                <div v-if="!slot.piece" class="w-full h-full flex items-center justify-center text-gray-600 text-sm font-bold bg-white bg-opacity-80 rounded">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Pieces -->
        <div class="game-card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
            {{ t('puzzle.available_pieces') }}
          </h3>
          <div class="flex flex-wrap justify-center gap-3">
            <div 
              v-for="(piece, index) in availablePieces" 
              :key="index"
              class="puzzle-piece w-16 h-16 rounded-lg border-2 transition-transform overflow-hidden"
              :class="{
                'border-yellow-500 cursor-move hover:scale-105': isPiecePlaced(piece) && isPieceCorrectlyPlaced(piece),
                'border-red-500 cursor-not-allowed opacity-50': isPiecePlaced(piece) && !isPieceCorrectlyPlaced(piece),
                'border-gray-300 cursor-move hover:scale-105': !isPiecePlaced(piece)
              }"
              :draggable="canDragPiece(piece)"
              @dragstart="dragStart($event, piece)"
            >
              <div class="puzzle-piece-preview w-full h-full" :style="getPieceImageStyle(piece, piece - 1)">
              </div>
            </div>
          </div>
        </div>

        <!-- Completion Message -->
        <div v-if="puzzleCompleted" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl p-8 max-w-2xl mx-4 text-center">
            <!-- Full completed picture -->
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                {{ t('puzzle.completed') }}
              </h2>
              <div class="w-64 h-48 mx-auto rounded-lg overflow-hidden border-4 shadow-lg">
                <img 
                  v-if="isClient"
                  :src="currentImageUrl" 
                  alt="Completed Puzzle"
                  class="w-full h-full object-contain"
                />
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div class="text-gray-500">Loading...</div>
                </div>
              </div>
            </div>
            
            <!-- Congratulations message below the picture -->
            <div class="mb-6">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-2xl">
                🎉
              </div>
              <p class="text-gray-600 text-lg">
                {{ t('puzzle.success') }}
              </p>
            </div>
            
            <!-- Action buttons -->
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '#imports'
import { DIFFICULTY_LEVELS, DIFFICULTY_PIECES_REQUIRED } from '~/constants/difficulty'

const router = useRouter()
const { $config } = useNuxtApp()

// i18n
const { t } = useI18n()

// Get base URL for assets
const baseURL = $config.app.baseURL || '/'

// Available puzzle images - dynamically loaded from public/puzzles folder
const puzzleImages = ref<string[]>([])

// Randomly select a puzzle image
const currentImage = ref('pokemon.webp') // Default fallback
const isClient = ref(false)

// Computed property for full image URL
const currentImageUrl = computed(() => `${baseURL}puzzles/${currentImage.value}`)

// Puzzle state
const totalPieces = ref(DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.EASY]) // Default to easy level
const puzzleSlots = ref(Array.from({ length: DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.EASY] }, (_, i) => ({ id: i, piece: null as number | null })))
const availablePieces = ref(Array.from({ length: DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.EASY] }, (_, i) => i + 1))

console.log('Initial available pieces:', availablePieces.value)
const placedPieces = ref(0)
const puzzleCompleted = ref(false)
const draggedPiece = ref<number | null>(null)

// Computed properties for puzzle logic
const puzzleContainerStyle = computed(() => {
  const cols = Math.ceil(Math.sqrt(totalPieces.value))
  const rows = Math.ceil(totalPieces.value / cols)
  const pieceSize = 100 // Size of each puzzle piece in pixels
  return {
    width: `${cols * pieceSize}px`,
    height: `${rows * pieceSize}px`,
    maxWidth: '100%'
  }
})

const puzzleBackgroundStyle = computed(() => {
  return {
    backgroundImage: `url(${currentImageUrl.value})`,
    backgroundSize: 'contain', // Show full image instead of cropping
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6' // Fallback background
  }
})

const getHoverAreaStyle = (index: number) => {
  const cols = Math.ceil(Math.sqrt(totalPieces.value))
  const rows = Math.ceil(totalPieces.value / cols)
  const pieceWidth = 100 / cols // Percentage width
  const pieceHeight = 100 / rows // Percentage height
  
  const row = Math.floor(index / cols)
  const col = index % cols
  
  return {
    width: `${pieceWidth}%`,
    height: `${pieceHeight}%`,
    left: `${col * pieceWidth}%`,
    top: `${row * pieceHeight}%`,
    border: '2px dashed #6b7280',
    borderRadius: '4px'
  }
}

const isCorrectPosition = (piece: number, slotIndex: number) => {
  return piece === slotIndex + 1
}

const isPiecePlaced = (piece: number) => {
  return puzzleSlots.value.some(slot => slot.piece === piece)
}

const isPieceCorrectlyPlaced = (piece: number) => {
  const placedSlot = puzzleSlots.value.find(slot => slot.piece === piece)
  if (!placedSlot) return false
  
  const slotIndex = puzzleSlots.value.indexOf(placedSlot)
  return isCorrectPosition(piece, slotIndex)
}

const canDragPiece = (piece: number) => {
  if (!isPiecePlaced(piece)) return true
  return isPieceCorrectlyPlaced(piece)
}

const getSlotClass = (index: number) => {
  const slot = puzzleSlots.value[index]
  if (!slot) return 'puzzle-slot relative overflow-hidden border-2 border-dashed border-gray-300 bg-gray-100'
  
  if (slot.piece && !isCorrectPosition(slot.piece, index)) {
    return 'puzzle-slot relative overflow-hidden border-2 border-red-500'
  }
  
  if (slot.piece) {
    return 'puzzle-slot relative overflow-hidden'
  }
  
  return 'puzzle-slot relative overflow-hidden border-2 border-dashed border-gray-300 bg-gray-100'
}

const checkPuzzleCompletion = () => {
  const allCorrect = puzzleSlots.value.every((slot, index) => 
    slot.piece && isCorrectPosition(slot.piece, index)
  )
  
  if (allCorrect && placedPieces.value === totalPieces.value) {
    puzzleCompleted.value = true
  }
}

const getPieceImageStyle = (piece: number, slotIndex: number) => {
  // Dynamic grid calculation based on total pieces
  const cols = Math.ceil(Math.sqrt(totalPieces.value))
  const rows = Math.ceil(totalPieces.value / cols)
  
  // Calculate which row and column this piece should be in (0-based)
  const pieceRow = Math.floor((piece - 1) / cols)
  const pieceCol = (piece - 1) % cols
  
  // Use fixed pixel values for better control
  const pieceWidth = 64 // w-16 = 64px
  const pieceHeight = 64 // h-16 = 64px
  
  // Calculate total image size dynamically
  const totalWidth = cols * pieceWidth
  const totalHeight = rows * pieceHeight
  
  return {
    backgroundImage: `url(${currentImageUrl.value})`,
    backgroundSize: `${totalWidth}px ${totalHeight}px`,
    backgroundPosition: `-${pieceCol * pieceWidth}px -${pieceRow * pieceHeight}px`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#f3f4f6' // Fallback color
  }
}

// Helper function to get required pieces for each level
const getRequiredPieces = (level: string) => {
  return DIFFICULTY_PIECES_REQUIRED[level as keyof typeof DIFFICULTY_PIECES_REQUIRED] || DIFFICULTY_PIECES_REQUIRED[DIFFICULTY_LEVELS.EASY]
}

// Load progress from localStorage using useAsyncData
const { data: savedProgress } = await useAsyncData(
  'puzzle-progress',
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

// Load puzzle images from generated JSON file
const { data: puzzleImagesData } = await useAsyncData(
  'puzzle-images',
  async () => {
    try {
      console.log('Loading puzzle images from JSON...')
      
      // Fetch the generated puzzle images JSON file from public directory
      const response = await $fetch('/puzzle-images.json')
      console.log('Puzzle data:', response)
      
      const images = response?.images || []
      console.log(`Found ${images.length} puzzle images:`, images)
      
      return images.length > 0 ? images : ['pokemon.webp'] // Fallback
    } catch (error) {
      console.error('Error loading puzzle images from JSON:', error)
      // Fallback to hardcoded list if JSON doesn't exist
      return ['pokemon.webp', 'xuka.webp', 'pokemon-3.webp']
    }
  },
  {
    default: () => ['pokemon.webp'],
    server: false // Only run on client side
  }
)

// Update puzzleImages ref when data loads
watch(puzzleImagesData, (images) => {
  if (images && images.length > 0) {
    puzzleImages.value = images
    // Select random image
    currentImage.value = images[Math.floor(Math.random() * images.length)]
  }
}, { immediate: true })

// Set client flag
onMounted(() => {
  isClient.value = true
})

// Update puzzle state when data loads
watch(savedProgress, (progress) => {
  if (progress) {
    const parsed = JSON.parse(progress)
    const collectedPieces = parsed.collectedPieces || 0
    const currentLevel = parsed.currentLevel || 'easy'
    
    // Get required pieces for current level
    const requiredPieces = getRequiredPieces(currentLevel)
    totalPieces.value = requiredPieces
    
    // Update puzzle slots
    puzzleSlots.value = Array.from({ length: requiredPieces }, (_, i) => ({ id: i, piece: null as number | null }))
    
    // Show all pieces that have been collected
    const piecesToShow = Math.max(collectedPieces, requiredPieces) // Ensure we show at least the required pieces
    availablePieces.value = Array.from({ length: piecesToShow }, (_, i) => i + 1)
    
    console.log('Available pieces:', availablePieces.value)
    console.log('Collected pieces:', collectedPieces)
    console.log('Required pieces:', requiredPieces)
    console.log('Pieces to show:', piecesToShow)
    
    // If not enough pieces collected, redirect to main page
    if (collectedPieces < requiredPieces) {
      alert(t('puzzle.not_enough_pieces'))
      router.push('/')
    }
  } else {
    router.push('/')
  }
}, { immediate: true })

// Methods
const dragStart = (event: DragEvent, piece: number) => {
  // Check if this piece is already placed in a slot
  const placedSlot = puzzleSlots.value.find(slot => slot.piece === piece)
  
  if (placedSlot) {
    // Check if it's in the correct position
    const slotIndex = puzzleSlots.value.indexOf(placedSlot)
    const isCorrect = isCorrectPosition(piece, slotIndex)
    
    // If it's wrong, prevent dragging
    if (!isCorrect) {
      event.preventDefault()
      return
    }
  }
  
  draggedPiece.value = piece
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const dropPiece = (event: DragEvent, slotIndex: number) => {
  event.preventDefault()
  
  if (!draggedPiece.value) return
  
  const slot = puzzleSlots.value[slotIndex]
  
  // If slot is already occupied, don't place piece
  if (slot?.piece) return
  
  // Check if the piece is in the correct position
  const isCorrect = isCorrectPosition(draggedPiece.value, slotIndex)
  
  if (isCorrect) {
    // Correct placement - place the piece and remove from available pieces
    if (slot && draggedPiece.value !== null) {
      slot.piece = draggedPiece.value
    }
    
    // Remove piece from available pieces
    const pieceIndex = availablePieces.value.indexOf(draggedPiece.value)
    if (pieceIndex > -1) {
      availablePieces.value.splice(pieceIndex, 1)
    }
    
    placedPieces.value++
    
    // Check if puzzle is completed with proper validation
    checkPuzzleCompletion()
  } else {
    // Wrong placement - don't place the piece, it stays in available pieces
    // The piece automatically returns to available pieces since we don't remove it
  }
  
  draggedPiece.value = null
}

const playAgain = () => {
  // Select a new random image
  if (puzzleImages.value.length > 0) {
    currentImage.value = puzzleImages.value[Math.floor(Math.random() * puzzleImages.value.length)]
  }
  
  // Reset puzzle using the correct number of pieces
  puzzleSlots.value = Array.from({ length: totalPieces.value }, (_, i) => ({ id: i, piece: null }))
  availablePieces.value = Array.from({ length: totalPieces.value }, (_, i) => i + 1)
  placedPieces.value = 0
  puzzleCompleted.value = false
  draggedPiece.value = null
}

const resetGame = () => {
  if (confirm(t('app.reset_confirm'))) {
    // Clear all progress
    localStorage.removeItem('vui-hoc-progress')
    
    // Reset puzzle state
    puzzleSlots.value = Array.from({ length: 12 }, (_, i) => ({ id: i, piece: null }))
    availablePieces.value = []
    placedPieces.value = 0
    puzzleCompleted.value = false
    draggedPiece.value = null
    
    // Redirect to home page
    router.push('/')
  }
}

const goBack = () => {
  router.push('/')
}

// Watch for completion
watch(placedPieces, (newValue) => {
  if (newValue === totalPieces.value) {
    // Award completion bonus
    const savedProgress = localStorage.getItem('vui-hoc-progress')
    const progress = savedProgress ? JSON.parse(savedProgress) : {}
    progress.puzzleCompleted = true
    progress.completionDate = new Date().toISOString()
    localStorage.setItem('vui-hoc-progress', JSON.stringify(progress))
  }
})
</script>

