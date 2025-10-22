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
            <h1 class="text-xl font-bold text-gray-900">{{ t('puzzle.title') }}</h1>
            <div class="text-sm text-gray-600">{{ placedPieces }}/{{ totalPieces }} {{ t('game.pieces_collected') }}</div>
          </div>
          <div class="w-20"></div>
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
          <div class="grid grid-cols-4 gap-2 mb-6" style="aspect-ratio: 1;">
            <div 
              v-for="(slot, index) in puzzleSlots" 
              :key="index"
              class="border-2 border-dashed rounded-lg flex items-center justify-center min-h-20"
              :class="slot.piece ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'"
              @drop="dropPiece($event, index)"
              @dragover.prevent
              @dragenter.prevent
            >
              <div v-if="slot.piece" class="puzzle-piece w-full h-full flex items-center justify-center text-white font-bold">
                {{ slot.piece }}
              </div>
              <div v-else class="text-gray-400 text-sm">
                {{ t('puzzle.position') }} {{ index + 1 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Available Pieces -->
        <div class="game-card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">
            {{ t('puzzle.available_pieces') }}
          </h3>
          <div class="grid grid-cols-4 gap-3">
            <div 
              v-for="(piece, index) in availablePieces" 
              :key="index"
              class="puzzle-piece aspect-square flex items-center justify-center text-white font-bold cursor-move"
              draggable="true"
              @dragstart="dragStart($event, piece)"
            >
              {{ piece }}
            </div>
          </div>
        </div>

        <!-- Completion Message -->
        <div v-if="puzzleCompleted" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-4xl">
              🎉
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              {{ t('puzzle.completed') }}
            </h2>
            <p class="text-gray-600 mb-6">
              {{ t('puzzle.success') }}
            </p>
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
const router = useRouter()

// i18n
const { t } = useI18n()

// Puzzle state
const totalPieces = ref(12)
const puzzleSlots = ref(Array.from({ length: 12 }, (_, i) => ({ id: i, piece: null })))
const availablePieces = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
const placedPieces = ref(0)
const puzzleCompleted = ref(false)
const draggedPiece = ref(null)

// Load progress from localStorage
onMounted(() => {
  const savedProgress = localStorage.getItem('vui-hoc-progress')
  if (savedProgress) {
    const progress = JSON.parse(savedProgress)
    const collectedPieces = progress.collectedPieces || 0
    
    // Only show pieces that have been collected
    availablePieces.value = Array.from({ length: collectedPieces }, (_, i) => i + 1)
    
    // If not enough pieces collected, redirect to main page
    if (collectedPieces < totalPieces.value) {
      alert(t('puzzle.not_enough_pieces', { total: totalPieces.value }))
      router.push('/')
    }
  } else {
    router.push('/')
  }
})

// Methods
const dragStart = (event: DragEvent, piece: number) => {
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
  if (slot.piece) return
  
  // Place the piece
  slot.piece = draggedPiece.value
  
  // Remove piece from available pieces
  const pieceIndex = availablePieces.value.indexOf(draggedPiece.value)
  if (pieceIndex > -1) {
    availablePieces.value.splice(pieceIndex, 1)
  }
  
  placedPieces.value++
  
  // Check if puzzle is completed
  if (placedPieces.value === totalPieces.value) {
    setTimeout(() => {
      puzzleCompleted.value = true
    }, 500)
  }
  
  draggedPiece.value = null
}

const playAgain = () => {
  // Reset puzzle
  puzzleSlots.value = Array.from({ length: 12 }, (_, i) => ({ id: i, piece: null }))
  availablePieces.value = Array.from({ length: 12 }, (_, i) => i + 1)
  placedPieces.value = 0
  puzzleCompleted.value = false
  draggedPiece.value = null
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

