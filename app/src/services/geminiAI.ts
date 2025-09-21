'use client'

const GEMINI_API_KEY = 'AIzaSyAWmOcIpzvLm42HMUSxIihueKcLtjQnvEM'
// Use the correct model name for v1beta API
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export interface GeminiResponse {
  success: boolean
  content?: string
  error?: string
}

export interface ImprovementOptions {
  type: 'grammar' | 'enhance' | 'both'
  contentType: 'story' | 'poem' | 'comic' | 'description'
  preserveStyle?: boolean
  targetLength?: 'shorter' | 'longer' | 'same'
}

class GeminiAIService {
  // Test function to verify API connectivity
  async testConnection(): Promise<GeminiResponse> {
    console.log('Testing Gemini API connection...')
    return this.makeRequest('Hello, please respond with "API is working correctly"')
  }

  // List available models
  async listModels(): Promise<GeminiResponse> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to list models: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return {
        success: true,
        content: JSON.stringify(data.models?.map((m: any) => m.name) || [], null, 2)
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list models'
      }
    }
  }
  private async makeRequest(prompt: string): Promise<GeminiResponse> {
    try {
      console.log('Making Gemini API request...', { url: `${GEMINI_API_URL}?key=${GEMINI_API_KEY.slice(0, 10)}...` })
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH', 
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      })

      console.log('API Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('API Response data:', data)
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return {
          success: true,
          content: data.candidates[0].content.parts[0].text
        }
      } else {
        console.error('Invalid response format:', data)
        throw new Error('Invalid response format from Gemini API')
      }
    } catch (error) {
      console.error('Gemini AI API Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async correctGrammar(text: string, contentType: string = 'general'): Promise<GeminiResponse> {
    const prompt = `Please correct the grammar and spelling in the following ${contentType} while preserving the original meaning, tone, and style. Only fix grammatical errors, spelling mistakes, and punctuation issues. Do not change the content, creativity, or voice of the author.

Text to correct:
"""
${text}
"""

Return only the corrected text without any explanations or additional comments.`

    return this.makeRequest(prompt)
  }

  async enhanceContent(text: string, options: ImprovementOptions): Promise<GeminiResponse> {
    const { contentType, preserveStyle = true, targetLength = 'same' } = options
    
    let enhancementInstructions = ''
    
    switch (contentType) {
      case 'story':
        enhancementInstructions = `Enhance this story by improving narrative flow, character development, and descriptive language. Make it more engaging and immersive while maintaining the original plot and characters.`
        break
      case 'poem':
        enhancementInstructions = `Enhance this poem by improving rhythm, imagery, and poetic devices. Strengthen the emotional impact and artistic expression while preserving the original theme and meaning.`
        break
      case 'comic':
        enhancementInstructions = `Enhance this comic script/description by improving dialogue, pacing, and visual descriptions. Make the characters more vivid and the scenes more engaging.`
        break
      case 'description':
        enhancementInstructions = `Enhance this description by making it more compelling, clear, and engaging. Improve the language while keeping it concise and informative.`
        break
    }

    const lengthInstruction = targetLength === 'shorter' 
      ? 'Make it more concise and remove unnecessary words.'
      : targetLength === 'longer'
      ? 'Expand and add more detail and depth.'
      : 'Keep the length approximately the same.'

    const styleInstruction = preserveStyle 
      ? 'Preserve the original writing style, voice, and tone of the author.'
      : 'You may adjust the writing style to make it more polished and professional.'

    const prompt = `${enhancementInstructions}

${styleInstruction}
${lengthInstruction}

Original ${contentType}:
"""
${text}
"""

Return only the enhanced version without any explanations or additional comments.`

    return this.makeRequest(prompt)
  }

  async improveDescription(description: string, title: string, contentType: string): Promise<GeminiResponse> {
    const prompt = `Create an improved and more engaging NFT description for a literary work. The description should be compelling for potential collectors and clearly convey the value and uniqueness of this literary NFT.

Title: "${title}"
Content Type: ${contentType}
Current Description: "${description}"

Please create an enhanced description that:
- Is more engaging and marketable for NFT collectors
- Highlights the literary merit and uniqueness
- Maintains the original essence and meaning
- Is suitable for an NFT marketplace
- Is between 100-200 words

Return only the improved description without any explanations.`

    return this.makeRequest(prompt)
  }

  async generateTitle(content: string, contentType: string): Promise<GeminiResponse> {
    const prompt = `Based on the following ${contentType}, suggest 3 compelling and creative titles that would work well for a literary NFT. The titles should be:
- Memorable and engaging
- Reflective of the content's theme or essence
- Suitable for an NFT marketplace
- Original and creative

${contentType.charAt(0).toUpperCase() + contentType.slice(1)} content:
"""
${content.substring(0, 500)}...
"""

Format your response as:
1. [Title 1]
2. [Title 2] 
3. [Title 3]`

    return this.makeRequest(prompt)
  }

  async getContentSuggestions(contentType: string, theme?: string): Promise<GeminiResponse> {
    const prompt = `Provide creative writing prompts and suggestions for a ${contentType} that would make an excellent literary NFT. ${theme ? `The theme should be related to: ${theme}` : ''}

Please provide:
1. 3 unique story/content ideas
2. Suggested themes and elements
3. Tips for making it NFT-worthy (unique, collectible, memorable)

Keep suggestions brief and inspiring for a creative writer.`

    return this.makeRequest(prompt)
  }
}

export const geminiAI = new GeminiAIService()