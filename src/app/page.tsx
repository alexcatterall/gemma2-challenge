'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      if (response.ok) {
        setGeneratedText(data.generated_text)
      } else {
        setGeneratedText(`Error: ${data.error}`)
      }
    } catch (error) {
      setGeneratedText('An error occurred while generating the response.')
    }
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Gemma2 Text Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here"
              className="w-full"
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </form>
          {generatedText && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Generated Text:</h2>
              <p className="whitespace-pre-wrap">{generatedText}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

