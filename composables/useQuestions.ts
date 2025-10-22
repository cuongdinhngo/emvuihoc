export interface Question {
  id: string
  type: 'mcq' | 'true-false'
  question: string
  options?: string[]
  correct: number | boolean
  explanation?: string
  points: number
}

export interface QuestionBank {
  subjects: {
    [key: string]: {
      name: string
      icon: string
      color: string
      difficulties: {
        [key: string]: Question[]
      }
    }
  }
}

// Import questions directly from JSON file
import questionBankData from '~/data/questions.json'

export const useQuestions = () => {
  const questionBank = ref<QuestionBank>(questionBankData as QuestionBank)

  const getQuestionsBySubject = (subject: string, difficulty: string) => {
    if (!questionBank.value) return []
    return questionBank.value.subjects[subject]?.difficulties[difficulty] || []
  }

  const getRandomQuestions = (subject: string, difficulty: string, count: number) => {
    const subjectQuestions = getQuestionsBySubject(subject, difficulty)
    return subjectQuestions.sort(() => 0.5 - Math.random()).slice(0, count)
  }

  const getSubjectInfo = (subject: string) => {
    if (!questionBank.value) return null
    return questionBank.value.subjects[subject] || null
  }

  const getAllSubjects = () => {
    if (!questionBank.value) return []
    return Object.keys(questionBank.value.subjects).map(key => ({
      id: key,
      ...questionBank.value!.subjects[key]
    }))
  }

  return {
    questionBank: readonly(questionBank),
    getQuestionsBySubject,
    getRandomQuestions,
    getSubjectInfo,
    getAllSubjects
  }
}
