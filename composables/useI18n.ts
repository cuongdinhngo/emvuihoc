export const useI18n = () => {
  const locale = ref('vi')
  
  const translations = ref({
    vi: {
      app: {
        title: 'Vui Học',
        welcome: 'Chào mừng đến với Vui Học!',
        subtitle: 'Học tập thông qua trò chơi ghép hình siêu thú vị!',
        loading: 'Đang tải...',
        back: 'Quay lại',
        play_again: 'Chơi lại',
        go_home: 'Quay về trang chủ'
      },
      levels: {
        easy: 'Dễ',
        medium: 'Trung bình', 
        hard: 'Khó',
        easy_desc: 'Câu hỏi cơ bản',
        medium_desc: 'Câu hỏi nâng cao',
        hard_desc: 'Câu hỏi thử thách',
        pieces_required: 'mảnh ghép cần thiết'
      },
      subjects: {
        select_subject: 'Chọn môn học',
        history: 'Lịch sử',
        geography: 'Địa lý', 
        science: 'Khoa học',
        ethics: 'Đạo đức',
        health: 'Sức khỏe',
        questions_count: 'câu hỏi'
      },
      game: {
        question: 'Câu',
        of: 'của',
        select_level: 'Chọn mức độ',
        start_game: 'Bắt đầu chơi',
        answer: 'Trả lời',
        processing: 'Đang xử lý...',
        checking: 'Đang kiểm tra câu trả lời...',
        correct: 'Chính xác!',
        incorrect: 'Chưa đúng!',
        next_question: 'Câu hỏi tiếp theo',
        completed: 'Hoàn thành!',
        congratulations: 'Chúc mừng! Bạn đã hoàn thành!',
        score: 'Bạn đã trả lời đúng',
        puzzle_piece: 'Bạn đã nhận được 1 mảnh ghép!',
        puzzle_complete: 'Bạn đã ghép thành công tất cả các mảnh hình!',
        puzzle_start: 'Bắt đầu ghép hình!',
        puzzle_progress: 'Tiến độ ghép hình',
        pieces_collected: 'mảnh đã đặt'
      },
      puzzle: {
        title: 'Ghép hình',
        instructions: 'Ghép các mảnh hình để hoàn thành bức tranh!',
        drag_drop: 'Kéo thả các mảnh ghép vào vị trí đúng',
        available_pieces: 'Mảnh ghép có sẵn',
        position: 'Vị trí',
        completed: 'Tuyệt vời! Bạn đã hoàn thành!',
        success: 'Bạn đã ghép thành công tất cả các mảnh hình!'
      },
      ui: {
        level: 'Level',
        pieces: 'Pieces',
        true: 'Đúng',
        false: 'Sai',
        loading_questions: 'Đang tải câu hỏi...',
        processing: 'Đang xử lý...',
        submit: 'Trả lời',
        select_answer: 'Chọn đáp án',
        drag_pieces: 'Kéo thả mảnh ghép'
      }
    },
    en: {
      app: {
        title: 'Fun Learning',
        welcome: 'Welcome to Fun Learning!',
        subtitle: 'Learn through exciting puzzle games!',
        loading: 'Loading...',
        back: 'Back',
        play_again: 'Play Again',
        go_home: 'Go Home'
      },
      levels: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        easy_desc: 'Basic questions',
        medium_desc: 'Advanced questions', 
        hard_desc: 'Challenging questions',
        pieces_required: 'puzzle pieces required'
      },
      subjects: {
        select_subject: 'Choose Subject',
        history: 'History',
        geography: 'Geography',
        science: 'Science', 
        ethics: 'Ethics',
        health: 'Health',
        questions_count: 'questions'
      },
      game: {
        question: 'Question',
        of: 'of',
        select_level: 'Select Level',
        start_game: 'Start Game',
        answer: 'Answer',
        processing: 'Processing...',
        checking: 'Checking your answer...',
        correct: 'Correct!',
        incorrect: 'Not quite right!',
        next_question: 'Next Question',
        completed: 'Completed!',
        congratulations: 'Congratulations! You\'ve completed it!',
        score: 'You answered correctly',
        puzzle_piece: 'You\'ve earned 1 puzzle piece!',
        puzzle_complete: 'You\'ve successfully assembled all puzzle pieces!',
        puzzle_start: 'Start Puzzle Assembly!',
        puzzle_progress: 'Puzzle Progress',
        pieces_collected: 'pieces placed'
      },
      puzzle: {
        title: 'Puzzle Assembly',
        instructions: 'Assemble the puzzle pieces to complete the picture!',
        drag_drop: 'Drag and drop puzzle pieces to the correct positions',
        available_pieces: 'Available Pieces',
        position: 'Position',
        completed: 'Excellent! You\'ve completed it!',
        success: 'You\'ve successfully assembled all puzzle pieces!'
      },
      ui: {
        level: 'Level',
        pieces: 'Pieces', 
        true: 'True',
        false: 'False',
        loading_questions: 'Loading questions...',
        processing: 'Processing...',
        submit: 'Submit',
        select_answer: 'Select Answer',
        drag_pieces: 'Drag Pieces'
      }
    }
  })

  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = translations.value[locale.value]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const setLocale = (newLocale: string) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  // Load saved locale
  onMounted(() => {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && translations.value[savedLocale]) {
      locale.value = savedLocale
    }
  })

  return {
    locale: readonly(locale),
    t,
    setLocale
  }
}
