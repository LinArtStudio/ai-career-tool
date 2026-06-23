import { chat, parseJSON } from '@/lib/llm/deepseek'

// Mock fetch
global.fetch = jest.fn()

describe('deepseek', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.LLM_API_URL = 'https://test.api.com'
    process.env.LLM_API_KEY='***'
  })

  describe('chat', () => {
    it('should throw error when API key is not set', async () => {
      process.env.LLM_API_KEY = ''
      await expect(chat([{ role: 'user', content: 'test' }])).rejects.toThrow('LLM_API_KEY not set')
    })

    it('should call API with correct parameters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'test response' } }]
        })
      }
      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await chat([{ role: 'user', content: 'test' }])

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.api.com',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: expect.stringContaining('Bearer')
          }),
          body: expect.any(String)
        })
      )
      expect(result).toBe('test response')
    })

    it('should throw error when API returns error', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue('Bad Request')
      }
      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      await expect(chat([{ role: 'user', content: 'test' }])).rejects.toThrow('LLM API error')
    })
  })

  describe('parseJSON', () => {
    it('should parse valid JSON string', () => {
      const json = '{"key": "value"}'
      const result = parseJSON(json)
      expect(result).toEqual({ key: 'value' })
    })

    it('should parse JSON wrapped in markdown code block', () => {
      const json = '```json\n{"key": "value"}\n```'
      const result = parseJSON(json)
      expect(result).toEqual({ key: 'value' })
    })

    it('should throw error for invalid JSON', () => {
      const json = 'invalid json'
      expect(() => parseJSON(json)).toThrow()
    })

    it('should handle nested JSON', () => {
      const json = '{"nested": {"key": "value"}}'
      const result = parseJSON(json)
      expect(result).toEqual({ nested: { key: 'value' } })
    })
  })
})
