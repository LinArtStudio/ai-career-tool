import { 
  INTERVIEW_DATABASE, 
  searchQuestions, 
  getRandomQuestions,
  getCompanies,
  getPositions,
  getCategories
} from '@/lib/data/interview-questions'

describe('interview-questions', () => {
  describe('INTERVIEW_DATABASE', () => {
    it('should have more than 150 questions', () => {
      expect(INTERVIEW_DATABASE.length).toBeGreaterThanOrEqual(150)
    })

    it('should have all required fields', () => {
      INTERVIEW_DATABASE.forEach((q) => {
        expect(q).toHaveProperty('id')
        expect(q).toHaveProperty('company')
        expect(q).toHaveProperty('position')
        expect(q).toHaveProperty('category')
        expect(q).toHaveProperty('question')
        expect(q).toHaveProperty('difficulty')
        expect(q).toHaveProperty('tips')
        expect(q).toHaveProperty('source')
      })
    })

    it('should have valid difficulty levels', () => {
      const validDifficulties = ['easy', 'medium', 'hard']
      INTERVIEW_DATABASE.forEach((q) => {
        expect(validDifficulties).toContain(q.difficulty)
      })
    })

    it('should have unique IDs', () => {
      const ids = INTERVIEW_DATABASE.map(q => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('searchQuestions', () => {
    it('should return questions for valid company and position', () => {
      const results = searchQuestions('字节跳动', '产品经理')
      expect(results.length).toBeGreaterThan(0)
      results.forEach((q) => {
        expect(q.company).toBe('字节跳动')
        expect(q.position).toContain('产品')
      })
    })

    it('should return empty array for non-existent company', () => {
      const results = searchQuestions('不存在的公司', '产品经理')
      expect(results).toEqual([])
    })

    it('should return questions when only company is provided', () => {
      const results = searchQuestions('腾讯')
      expect(results.length).toBeGreaterThan(0)
      results.forEach((q) => {
        expect(q.company).toBe('腾讯')
      })
    })

    it('should return questions when only position is provided', () => {
      const results = searchQuestions(undefined, '前端开发')
      expect(results.length).toBeGreaterThan(0)
      results.forEach((q) => {
        expect(q.position).toContain('前端')
      })
    })
  })

  describe('getRandomQuestions', () => {
    it('should return requested number of questions', () => {
      const results = getRandomQuestions(5)
      expect(results.length).toBeLessThanOrEqual(5)
    })

    it('should return unique questions', () => {
      const results = getRandomQuestions(10)
      const ids = results.map(q => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should filter by company when provided', () => {
      const results = getRandomQuestions(5, '阿里巴巴')
      results.forEach((q) => {
        expect(q.company).toBe('阿里巴巴')
      })
    })

    it('should return all available questions when count exceeds database size', () => {
      const results = getRandomQuestions(1000)
      expect(results.length).toBeLessThanOrEqual(INTERVIEW_DATABASE.length)
    })
  })

  describe('getCompanies', () => {
    it('should return unique companies', () => {
      const companies = getCompanies()
      expect(companies.length).toBeGreaterThan(0)
      const uniqueCompanies = new Set(companies)
      expect(uniqueCompanies.size).toBe(companies.length)
    })

    it('should include major companies', () => {
      const companies = getCompanies()
      expect(companies).toContain('字节跳动')
      expect(companies).toContain('腾讯')
      expect(companies).toContain('阿里巴巴')
    })
  })

  describe('getPositions', () => {
    it('should return positions for specific company', () => {
      const positions = getPositions('字节跳动')
      expect(positions.length).toBeGreaterThan(0)
    })

    it('should return all positions when no company specified', () => {
      const positions = getPositions()
      expect(positions.length).toBeGreaterThan(0)
    })
  })

  describe('getCategories', () => {
    it('should return all categories', () => {
      const categories = getCategories()
      expect(categories.length).toBeGreaterThan(0)
      expect(categories).toContain('行为面试')
      expect(categories).toContain('技术面试')
    })
  })
})
