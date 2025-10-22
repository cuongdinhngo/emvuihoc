import { ref, readonly } from 'vue'
import exploreVietnamData from '~/data/explore-vietnam.json'
import scienceAroundUsData from '~/data/science-around-us.json'
import mathChallengeData from '~/data/math-challenge.json'
import earthFriendData from '~/data/earth-friend.json'

export interface Question {
  id: string
  type: string
  question: string
  options?: string[]
  correct: number | boolean
  explanation?: string
}

export interface Subject {
  name: string
  icon: string
  color: string
  difficulties: {
    [key: string]: Question[]
  }
}

export interface Sector {
  name: string
  description: string
  icon: string
  color: string
  subjects: {
    [key: string]: Subject
  }
}

export interface QuestionBank {
  [key: string]: Sector
}

export const useQuestions = () => {
  const questionBank = ref<QuestionBank>({
    'explore-vietnam': exploreVietnamData,
    'science-around-us': scienceAroundUsData,
    'math-challenge': mathChallengeData,
    'earth-friend': earthFriendData
  })

  const getQuestionsBySubject = (sector: string, subject: string, difficulty: string) => {
    if (!questionBank.value) return []
    return questionBank.value[sector]?.subjects[subject]?.difficulties[difficulty] || []
  }

  const getRandomQuestions = (sector: string, subject: string, difficulty: string, count: number) => {
    const subjectQuestions = getQuestionsBySubject(sector, subject, difficulty)
    return subjectQuestions.sort(() => 0.5 - Math.random()).slice(0, count)
  }

  const getSubjectInfo = (sector: string, subject: string) => {
    if (!questionBank.value || !questionBank.value[sector]) return null
    return questionBank.value[sector].subjects[subject] || null
  }

  const getSectorInfo = (sector: string) => {
    if (!questionBank.value) return null
    return questionBank.value[sector] || null
  }

  const getAllSectors = () => {
    if (!questionBank.value) return []
    const sectors = []
    for (const id in questionBank.value) {
      sectors.push({
        id,
        ...questionBank.value[id]
      })
    }
    return sectors
  }

  const getAllSubjects = (sector: string) => {
    if (!questionBank.value || !questionBank.value[sector]) return []
    const sectorData = questionBank.value[sector]
    const subjects = []
    for (const id in sectorData.subjects) {
      subjects.push({
        id,
        ...sectorData.subjects[id]
      })
    }
    return subjects
  }

  const getAllSubjectsFromAllSectors = () => {
    if (!questionBank.value) return []
    const allSubjects = []
    for (const sectorId in questionBank.value) {
      const sector = questionBank.value[sectorId]
      if (sector) {
        for (const subjectId in sector.subjects) {
          const subject = sector.subjects[subjectId]
          allSubjects.push({
            id: `${sectorId}-${subjectId}`,
            sectorId,
            sectorName: sector.name,
            ...subject
          })
        }
      }
    }
    return allSubjects
  }

  return {
    questionBank: readonly(questionBank),
    getQuestionsBySubject,
    getRandomQuestions,
    getSubjectInfo,
    getSectorInfo,
    getAllSectors,
    getAllSubjects,
    getAllSubjectsFromAllSectors
  }
}