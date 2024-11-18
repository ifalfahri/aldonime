import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Search, Sparkles } from 'lucide-react'
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

type Anime = {
  id: number
  title: { romaji: string; english: string }
  coverImage: { large: string }
  description: string
  averageScore: number
  episodes: number
  genres: string[]
}

const genreColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
]

export default function App() {
  const [anime, setAnime] = useState<Anime | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Anime[]>([])

  const fetchRandomAnime = async () => {
    const query = `
      query {
        Media(type: ANIME, sort: RANDOM) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          description(asHtml: false)
          averageScore
          episodes
          genres
        }
      }
    `

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
      })

      const data = await response.json()
      if (data.data && data.data.Media) {
        setAnime(data.data.Media)
        setIsModalOpen(true)
      } else {
        console.error('Unexpected response structure:', data)
      }
    } catch (error) {
      console.error('Error fetching random anime:', error)
    }
  }

  const searchAnime = async (search: string) => {
    const query = `
      query ($search: String) {
        Page(page: 1, perPage: 5) {
          media(type: ANIME, search: $search) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            description(asHtml: false)
            averageScore
            episodes
            genres
          }
        }
      }
    `

    const variables = { search }

    try {
      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables })
      })

      const data = await response.json()
      if (data.data && data.data.Page && data.data.Page.media) {
        setSuggestions(data.data.Page.media)
      } else {
        console.error('Unexpected response structure:', data)
      }
    } catch (error) {
      console.error('Error searching anime:', error)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      const debounce = setTimeout(() => {
        searchAnime(searchQuery)
      }, 300)

      return () => clearTimeout(debounce)
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  const handleSelectAnime = (selectedAnime: Anime) => {
    setAnime(selectedAnime)
    setIsModalOpen(true)
    setSearchQuery('')
    setSuggestions([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg border-gray-700">
        <CardContent className="p-6">
          <p className='text-center text-white font-light text-xs mb-2 tracking-widest'>ALDONIME</p>
          <h1 className="text-3xl font-bold text-center mb-6 text-white tracking-wider">Anime Explorer</h1>
          <div className="flex flex-col gap-4">
            <Button onClick={fetchRandomAnime} className="w-full bg-purple-600 hover:bg-purple-700">
              <Sparkles className="mr-2 h-4 w-4" />
              Random Anime
            </Button>
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-gray-700 text-white border-gray-600"
                />
                <Button onClick={() => searchAnime(searchQuery)} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {suggestions.length > 0 && (
                <Command className="absolute w-full mt-1 bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-lg border border-gray-700 rounded-md overflow-hidden">
                  <CommandList>
                    <CommandGroup>
                      {suggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion.id}
                          onSelect={() => handleSelectAnime(suggestion)}
                          className="cursor-pointer hover:bg-gray-700"
                        >
                          {suggestion.title.english || suggestion.title.romaji}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {anime && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-lg text-white border-gray-700 max-w-3xl">
            <DialogHeader>
              <DialogTitle>{anime.title.english || anime.title.romaji}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-[200px_1fr]">
              <img src={anime.coverImage.large} alt={anime.title.romaji} className="w-full rounded-lg md:w-[200px]" />
              <div className="space-y-4">
                <DialogDescription className="text-gray-300">{anime.description}</DialogDescription>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Episodes: {anime.episodes}</div>
                  <div>Score: {anime.averageScore}%</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre, index) => (
                    <Badge key={genre} className={`${genreColors[index % genreColors.length]} text-white`}>
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}