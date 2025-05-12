"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BookOpen, Search, Filter } from "lucide-react"

// Mock data for books with updated cover images
const BOOKS = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    year: 1925,
    available: true,
    coverUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-great-gatsby.jpg-tflYIFUSP7bn9XbnI5PS4pBzbb3Mo4.jpeg",
    description:
      "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    year: 1960,
    available: true,
    coverUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg",
    description:
      "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    category: "Science Fiction",
    year: 1949,
    available: false,
    coverUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
    description:
      "Among the seminal texts of the 20th century, 1984 is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    year: 1813,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pride.jpg-bZSoXiOwfQ1VzAER23J95PeBfEblmp.jpeg",
    description:
      "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    year: 1951,
    available: false,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBk7LgvyxkKKTa2chPfCDMXQ5K.webp",
    description:
      "The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield.",
  },
  {
    id: 6,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    year: 1937,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hobbit.jpg-3AXLU9PP1nyUtFJUNf82ctYWAxHESh.jpeg",
    description:
      "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar.",
  },
  {
    id: 7,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    year: 1997,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/potter.jpg-k0cdDc92ogEQWEPlX2HrmuPL0CTskS.jpeg",
    description:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive.",
  },
  {
    id: 8,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    year: 1954,
    available: false,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rings.jpg-FfjTEQAJ0FaYe83Gxkz4lWqzcSHfGO.jpeg",
    description:
      "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them.",
  },
  {
    id: 9,
    title: "The Da Vinci Code",
    author: "Dan Brown",
    category: "Mystery",
    year: 2003,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vinci.jpg-3LiOHvgd18gtOQJqX7Daa8NPce7Ote.jpeg",
    description:
      "While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night.",
  },
  {
    id: 10,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    year: 1988,
    available: true,
    coverUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alchemist.jpg-9apmKdvYqAcuS8vsbFKxEpbCw5IWJL.jpeg",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
  },
  {
    id: 11,
    title: "The Hunger Games",
    author: "Suzanne Collins",
    category: "Science Fiction",
    year: 2008,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hunger.jpg-8oMRzAtATy9gcgMyecYQRAIu1ln49t.webp",
    description:
      "In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts.",
  },
  {
    id: 12,
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "Science Fiction",
    year: 1932,
    available: false,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/world.jpg-CSZ1duVkKpWviTOUE0EVGNm4eeLiDG.jpeg",
    description:
      "Aldous Huxley's profoundly important classic of world literature, Brave New World is a searching vision of an unequal, technologically-advanced future.",
  },
  {
    id: 13,
    title: "The Odyssey",
    author: "Homer",
    category: "Classics",
    year: -800,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/odyssey.jpg-sl8Oh5adj1Wn5O0WNB85hYtLdwrCgQ.jpeg",
    description:
      "The epic tale of Odysseus and his ten-year journey home after the Trojan War forms one of the earliest and greatest works of Western literature.",
  },
  {
    id: 14,
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    category: "Classics",
    year: 1866,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crime.jpg-vbXK5YpDaUnLEuczrCintOgqFdpC92.jpeg",
    description:
      "Raskolnikov, an impoverished student living in the St. Petersburg of the tsars, is determined to overreach his humanity and assert his untrammeled individual will.",
  },
  {
    id: 15,
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    category: "Fiction",
    year: 2003,
    available: false,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
    description:
      "The unforgettable, heartbreaking story of the unlikely friendship between a wealthy boy and the son of his father's servant.",
  },
  {
    id: 16,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "Non-Fiction",
    year: 2014,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sapiens.jpg-ItXFyAl9oyz2umtP9Webab9hvk2yI4.jpeg",
    description:
      "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.",
  },
  {
    id: 17,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Thriller",
    year: 2019,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/patient.jpg-8rdci0vLXPYo3BC1plHvUNH2AQdN9m.jpeg",
    description:
      "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas.",
  },
  {
    id: 18,
    title: "Educated",
    author: "Tara Westover",
    category: "Biography",
    year: 2018,
    available: false,
    coverUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/educated.jpg-U7X5EJRbHtyOdrI9WF3soSk1R71K2t.jpeg",
    description:
      "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom.",
  },
  {
    id: 19,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    category: "Fiction",
    year: 2018,
    available: true,
    coverUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crawdads.jpg-HY13jW0YwxCS8fnTa1SoxM5YVwVQs4.jpeg",
    description:
      "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast.",
  },
  {
    id: 20,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    year: 2018,
    available: true,
    coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atomic.jpg-h6sGpx1p3GBkYqghcq8Qbh883o6N1i.jpeg",
    description:
      "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies.",
  },
]

// Categories for filtering
const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Romance",
  "Fantasy",
  "Mystery",
  "Classics",
  "Thriller",
  "Self-Help",
]

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort books
  const filteredBooks = BOOKS.filter((book) => {
    // Search term filter
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(book.category)

    // Availability filter
    const matchesAvailability = !availableOnly || book.available

    return matchesSearch && matchesCategory && matchesAvailability
  }).sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "author") {
      return a.author.localeCompare(b.author)
    } else if (sortBy === "year") {
      return b.year - a.year
    }
    return 0
  })

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Catalog</h1>

      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="year">Year (newest)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Availability</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available-only"
                      checked={availableOnly}
                      onCheckedChange={(checked) => setAvailableOnly(checked as boolean)}
                    />
                    <Label htmlFor="available-only" className="text-sm font-normal cursor-pointer">
                      Show only available books
                    </Label>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategories([])
                    setAvailableOnly(false)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredBooks.length} of {BOOKS.length} books
        </p>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <Link href={`/catalog/${book.id}`} key={book.id} className="group">
              <div className="border rounded-lg overflow-hidden transition-all group-hover:shadow-md h-full flex flex-col">
                <div className="aspect-[2/3] bg-gray-100 relative">
                  <img
                    src={book.coverUrl || "/placeholder.svg"}
                    alt={book.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "/open-book-library.png"
                    }}
                  />
                  {!book.available && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">Unavailable</div>
                  )}
                </div>
                <div className="p-3 flex-grow flex flex-col">
                  <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500">{book.author}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{book.category}</span>
                    <span className="text-xs text-gray-500">{book.year}</span>
                  </div>
                  <div className="mt-auto pt-3">
                    <Button
                      size="sm"
                      variant={book.available ? "default" : "outline"}
                      className="w-full text-xs h-8"
                      disabled={!book.available}
                    >
                      {book.available ? (
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Borrow
                        </span>
                      ) : (
                        "Unavailable"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
