"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { BookOpen, Star, Calendar, MapPin, ArrowLeft, Clock, Users, CreditCard } from "lucide-react"

// Define types for our book data
type Branch = {
  id: number
  name: string
  available: boolean
}

type SimilarBook = {
  id: number
  title: string
  author: string
  coverUrl: string
}

type Book = {
  id: number
  title: string
  author: string
  description: string
  category: string[]
  year: number
  publisher: string
  pages: number
  isbn: string
  available: boolean
  coverUrl: string
  rating: number
  reviews: number
  branches: Branch[]
  similarBooks: SimilarBook[]
}

// Enhanced book data function
const getBookData = (id: string): Book => {
  const bookId = Number.parseInt(id)

  // Collection of detailed book data
  const books: Book[] = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description:
        "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan. A true classic of American literature that captures the economic prosperity and social change of the 1920s.",
      category: ["Fiction", "Classics", "American Literature"],
      year: 1925,
      publisher: "Scribner",
      pages: 180,
      isbn: "9780743273565",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-great-gatsby.jpg-tflYIFUSP7bn9XbnI5PS4pBzbb3Mo4.jpeg",
      rating: 4.3,
      reviews: 42,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg",
        },
        {
          id: 4,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pride.jpg-bZSoXiOwfQ1VzAER23J95PeBfEblmp.jpeg",
        },
        {
          id: 5,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBk7LgvyxkKKTa2chPfCDMXQ5K.webp",
        },
        {
          id: 10,
          title: "The Alchemist",
          author: "Paulo Coelho",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alchemist.jpg-9apmKdvYqAcuS8vsbFKxEpbCw5IWJL.jpeg",
        },
      ],
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description:
        "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Through the young eyes of Scout and Jem Finch, Harper Lee explores with exuberant humor the irrationality of adult attitudes to race and class in the Deep South of the 1930s. The conscience of a town steeped in prejudice, violence, and hypocrisy is pricked by the stamina and quiet heroism of one man's struggle for justice.",
      category: ["Fiction", "Classics", "Historical Fiction"],
      year: 1960,
      publisher: "HarperCollins",
      pages: 281,
      isbn: "9780061120084",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg",
      rating: 4.5,
      reviews: 56,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-great-gatsby.jpg-tflYIFUSP7bn9XbnI5PS4pBzbb3Mo4.jpeg",
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
        },
        {
          id: 4,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pride.jpg-bZSoXiOwfQ1VzAER23J95PeBfEblmp.jpeg",
        },
        {
          id: 15,
          title: "The Kite Runner",
          author: "Khaled Hosseini",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
        },
      ],
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      description:
        "Among the seminal texts of the 20th century, 1984 is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell's nightmarish vision of a totalitarian, bureaucratic world and one poor stiff's attempt to find individuality. The brilliance of the novel is Orwell's prescience of modern life—the ubiquity of television, the distortion of the language—and his ability to construct such a thorough version of hell.",
      category: ["Science Fiction", "Classics", "Dystopian"],
      year: 1949,
      publisher: "Signet Classics",
      pages: 328,
      isbn: "9780451524935",
      available: false,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
      rating: 4.7,
      reviews: 63,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 12,
          title: "Brave New World",
          author: "Aldous Huxley",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/world.jpg-CSZ1duVkKpWviTOUE0EVGNm4eeLiDG.jpeg",
        },
        {
          id: 11,
          title: "The Hunger Games",
          author: "Suzanne Collins",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hunger.jpg-8oMRzAtATy9gcgMyecYQRAIu1ln49t.webp",
        },
        {
          id: 8,
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rings.jpg-FfjTEQAJ0FaYe83Gxkz4lWqzcSHfGO.jpeg",
        },
        {
          id: 5,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBk7LgvyxkKKTa2chPfCDMXQ5K.webp",
        },
      ],
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description:
        "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work 'her own darling child' and its vivacious heroine, Elizabeth Bennet, 'as delightful a creature as ever appeared in print.' The romantic clash between the opinionated Elizabeth and her proud beau, Mr. Darcy, is a splendid performance of civilized sparring.",
      category: ["Romance", "Classics", "Historical Fiction"],
      year: 1813,
      publisher: "Penguin Classics",
      pages: 432,
      isbn: "9780141439518",
      available: true,
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pride.jpg-bZSoXiOwfQ1VzAER23J95PeBfEblmp.jpeg",
      rating: 4.4,
      reviews: 48,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg",
        },
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-great-gatsby.jpg-tflYIFUSP7bn9XbnI5PS4pBzbb3Mo4.jpeg",
        },
        {
          id: 13,
          title: "The Odyssey",
          author: "Homer",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/odyssey.jpg-sl8Oh5adj1Wn5O0WNB85hYtLdwrCgQ.jpeg",
        },
        {
          id: 19,
          title: "Where the Crawdads Sing",
          author: "Delia Owens",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crawdads.jpg-HY13jW0YwxCS8fnTa1SoxM5YVwVQs4.jpeg",
        },
      ],
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      description:
        "The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield. Through circumstances that tend to preclude adult, secondhand description, he leaves his prep school in Pennsylvania and goes underground in New York City for three days. The boy himself is at once too simple and too complex for us to make any final comment about him or his story. Perhaps the safest thing we can say about Holden is that he was born in the world not just strongly attracted to beauty but, almost, hopelessly impaled on it.",
      category: ["Fiction", "Classics", "Coming of Age"],
      year: 1951,
      publisher: "Little, Brown and Company",
      pages: 277,
      isbn: "9780316769488",
      available: false,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBk7LgvyxkKKTa2chPfCDMXQ5K.webp",
      rating: 4.2,
      reviews: 39,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-great-gatsby.jpg-tflYIFUSP7bn9XbnI5PS4pBzbb3Mo4.jpeg",
        },
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg",
        },
        {
          id: 18,
          title: "Educated",
          author: "Tara Westover",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/educated.jpg-U7X5EJRbHtyOdrI9WF3soSk1R71K2t.jpeg",
        },
        {
          id: 15,
          title: "The Kite Runner",
          author: "Khaled Hosseini",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
        },
      ],
    },
    {
      id: 6,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      description:
        "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure. They have launched a plot to raid the treasure hoard guarded by Smaug the Magnificent, a large and very dangerous dragon. Bilbo reluctantly joins their quest, unaware that on his journey to the Lonely Mountain he will encounter both a magic ring and a frightening creature known as Gollum.",
      category: ["Fantasy", "Classics", "Adventure"],
      year: 1937,
      publisher: "Houghton Mifflin",
      pages: 310,
      isbn: "9780547928227",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hobbit.jpg-3AXLU9PP1nyUtFJUNf82ctYWAxHESh.jpeg",
      rating: 4.6,
      reviews: 52,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 8,
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rings.jpg-FfjTEQAJ0FaYe83Gxkz4lWqzcSHfGO.jpeg",
        },
        {
          id: 7,
          title: "Harry Potter and the Philosopher's Stone",
          author: "J.K. Rowling",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/potter.jpg-k0cdDc92ogEQWEPlX2HrmuPL0CTskS.jpeg",
        },
        {
          id: 10,
          title: "The Alchemist",
          author: "Paulo Coelho",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alchemist.jpg-9apmKdvYqAcuS8vsbFKxEpbCw5IWJL.jpeg",
        },
        {
          id: 11,
          title: "The Hunger Games",
          author: "Suzanne Collins",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hunger.jpg-8oMRzAtATy9gcgMyecYQRAIu1ln49t.webp",
        },
      ],
    },
    {
      id: 7,
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      description:
        "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. An incredible adventure is about to begin!",
      category: ["Fantasy", "Young Adult", "Magic"],
      year: 1997,
      publisher: "Bloomsbury",
      pages: 223,
      isbn: "9780747532743",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/potter.jpg-k0cdDc92ogEQWEPlX2HrmuPL0CTskS.jpeg",
      rating: 4.8,
      reviews: 78,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 6,
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hobbit.jpg-3AXLU9PP1nyUtFJUNf82ctYWAxHESh.jpeg",
        },
        {
          id: 8,
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rings.jpg-FfjTEQAJ0FaYe83Gxkz4lWqzcSHfGO.jpeg",
        },
        {
          id: 11,
          title: "The Hunger Games",
          author: "Suzanne Collins",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hunger.jpg-8oMRzAtATy9gcgMyecYQRAIu1ln49t.webp",
        },
        {
          id: 10,
          title: "The Alchemist",
          author: "Paulo Coelho",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alchemist.jpg-9apmKdvYqAcuS8vsbFKxEpbCw5IWJL.jpeg",
        },
      ],
    },
    {
      id: 8,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      description:
        "One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him. After many ages it fell into the hands of Bilbo Baggins, as told in The Hobbit.",
      category: ["Fantasy", "Classics", "Epic"],
      year: 1954,
      publisher: "Houghton Mifflin",
      pages: 1178,
      isbn: "9780618640157",
      available: false,
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rings.jpg-FfjTEQAJ0FaYe83Gxkz4lWqzcSHfGO.jpeg",
      rating: 4.9,
      reviews: 86,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 6,
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hobbit.jpg-3AXLU9PP1nyUtFJUNf82ctYWAxHESh.jpeg",
        },
        {
          id: 7,
          title: "Harry Potter and the Philosopher's Stone",
          author: "J.K. Rowling",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/potter.jpg-k0cdDc92ogEQWEPlX2HrmuPL0CTskS.jpeg",
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
        },
        {
          id: 11,
          title: "The Hunger Games",
          author: "Suzanne Collins",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hunger.jpg-8oMRzAtATy9gcgMyecYQRAIu1ln49t.webp",
        },
      ],
    },
    {
      id: 9,
      title: "The Da Vinci Code",
      author: "Dan Brown",
      description:
        "While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in baffling symbols. As Langdon and gifted French cryptologist Sophie Neveu sort through the bizarre riddles, they are stunned to discover a trail of clues hidden in the works of Leonardo da Vinci—clues visible for all to see and yet ingeniously disguised by the painter.",
      category: ["Mystery", "Thriller", "Suspense"],
      year: 2003,
      publisher: "Anchor",
      pages: 454,
      isbn: "9780307474278",
      available: true,
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vinci.jpg-3LiOHvgd18gtOQJqX7Daa8NPce7Ote.jpeg",
      rating: 4.1,
      reviews: 45,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 17,
          title: "The Silent Patient",
          author: "Alex Michaelides",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/patient.jpg-8rdci0vLXPYo3BC1plHvUNH2AQdN9m.jpeg",
        },
        {
          id: 10,
          title: "The Alchemist",
          author: "Paulo Coelho",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alchemist.jpg-9apmKdvYqAcuS8vsbFKxEpbCw5IWJL.jpeg",
        },
        {
          id: 15,
          title: "The Kite Runner",
          author: "Khaled Hosseini",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
        },
        {
          id: 19,
          title: "Where the Crawdads Sing",
          author: "Delia Owens",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crawdads.jpg-HY13jW0YwxCS8fnTa1SoxM5YVwVQs4.jpeg",
        },
      ],
    },
    {
      id: 10,
      title: "The Alchemist",
      author: "Paulo Coelho",
      description:
        "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined. Santiago's journey teaches us about the essential wisdom of listening to our hearts, of recognizing opportunity and learning to read the omens strewn along life's path, and, most importantly, to follow our dreams.",
      category: ["Fiction", "Philosophy", "Spirituality"],
      year: 1988,
      publisher: "HarperOne",
      pages: 197,
      isbn: "9780062315007",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alchemist.jpg-9apmKdvYqAcuS8vsbFKxEpbCw5IWJL.jpeg",
      rating: 4.4,
      reviews: 51,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-great-gatsby.jpg-tflYIFUSP7bn9XbnI5PS4pBzbb3Mo4.jpeg",
        },
        {
          id: 6,
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hobbit.jpg-3AXLU9PP1nyUtFJUNf82ctYWAxHESh.jpeg",
        },
        {
          id: 16,
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sapiens.jpg-ItXFyAl9oyz2umtP9Webab9hvk2yI4.jpeg",
        },
        {
          id: 20,
          title: "Atomic Habits",
          author: "James Clear",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atomic.jpg-h6sGpx1p3GBkYqghcq8Qbh883o6N1i.jpeg",
        },
      ],
    },
    {
      id: 11,
      title: "The Hunger Games",
      author: "Suzanne Collins",
      category: ["Science Fiction", "Young Adult", "Dystopian"],
      year: 2008,
      publisher: "Scholastic Press",
      pages: 374,
      isbn: "9780439023481",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hunger.jpg-8oMRzAtATy9gcgMyecYQRAIu1ln49t.webp",
      description:
        "In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV.",
      rating: 4.5,
      reviews: 58,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
        },
        {
          id: 12,
          title: "Brave New World",
          author: "Aldous Huxley",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/world.jpg-CSZ1duVkKpWviTOUE0EVGNm4eeLiDG.jpeg",
        },
        {
          id: 7,
          title: "Harry Potter and the Philosopher's Stone",
          author: "J.K. Rowling",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/potter.jpg-k0cdDc92ogEQWEPlX2HrmuPL0CTskS.jpeg",
        },
        {
          id: 8,
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rings.jpg-FfjTEQAJ0FaYe83Gxkz4lWqzcSHfGO.jpeg",
        },
      ],
    },
    {
      id: 12,
      title: "Brave New World",
      author: "Aldous Huxley",
      description:
        "Aldous Huxley's profoundly important classic of world literature, Brave New World is a searching vision of an unequal, technologically-advanced future where humans are genetically bred, socially indoctrinated, and pharmaceutically anesthetized to passively uphold an authoritarian ruling order.",
      category: ["Science Fiction", "Classics", "Dystopian"],
      year: 1932,
      publisher: "Harper Perennial",
      pages: 288,
      isbn: "9780060850524",
      available: false,
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/world.jpg-CSZ1duVkKpWviTOUE0EVGNm4eeLiDG.jpeg",
      rating: 4.5,
      reviews: 52,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
        },
        {
          id: 11,
          title: "The Hunger Games",
          author: "Suzanne Collins",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hunger.jpg-8oMRzAtATy9gcgMyecYQRAIu1ln49t.webp",
        },
        {
          id: 8,
          title: "The Lord of the Rings",
          author: "J.R.R. Tolkien",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rings.jpg-FfjTEQAJ0FaYe83Gxkz4lWqzcSHfGO.jpeg",
        },
        {
          id: 5,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBkKKTa2chPfCDMXQ5K.webp",
        },
      ],
    },
    {
      id: 13,
      title: "The Odyssey",
      author: "Homer",
      description:
        "The epic tale of Odysseus and his ten-year journey home after the Trojan War forms one of the earliest and greatest works of Western literature. Confronted by natural and supernatural threats – shipwrecks, battles, monsters and the implacable enmity of the sea-god Poseidon – Odysseus must use his wit and native cunning if he is to reach his homeland safely.",
      category: ["Classics", "Poetry", "Epic"],
      year: -800,
      publisher: "Penguin Classics",
      pages: 541,
      isbn: "9780140268867",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/odyssey.jpg-sl8Oh5adj1Wn5O0WNB85hYtLdwrCgQ.jpeg",
      rating: 4.3,
      reviews: 47,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 14,
          title: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crime.jpg-vbXK5YpDaUnLEuczrCintOgqFdpC92.jpeg",
        },
        {
          id: 4,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pride.jpg-bZSoXiOwfQ1VzAER23J95PeBfEblmp.jpeg",
        },
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-great-gatsby.jpg-tflYIFUSP7bn9XbnI5PS4pBzbb3Mo4.jpeg",
        },
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg",
        },
      ],
    },
    {
      id: 14,
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      description:
        "Raskolnikov, an impoverished student living in the St. Petersburg of the tsars, is determined to overreach his humanity and assert his untrammeled individual will. When he commits an act of murder and theft, he sets into motion a story that, for its excruciating suspense, its atmospheric vividness, and its depth of characterization and vision is almost unequaled in the literatures of the world.",
      category: ["Classics", "Fiction", "Philosophy"],
      year: 1866,
      publisher: "Penguin Classics",
      pages: 671,
      isbn: "9780143107637",
      available: true,
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crime.jpg-vbXK5YpDaUnLEuczrCintOgqFdpC92.jpeg",
      rating: 4.6,
      reviews: 58,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 13,
          title: "The Odyssey",
          author: "Homer",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/odyssey.jpg-sl8Oh5adj1Wn5O0WNB85hYtLdwrCgQ.jpeg",
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
        },
        {
          id: 12,
          title: "Brave New World",
          author: "Aldous Huxley",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/world.jpg-CSZ1duVkKpWviTOUE0EVGNm4eeLiDG.jpeg",
        },
        {
          id: 5,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBkKKTa2chPfCDMXQ5K.webp",
        },
      ],
    },
    {
      id: 15,
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      description:
        "The unforgettable, heartbreaking story of the unlikely friendship between a wealthy boy and the son of his father's servant, The Kite Runner is a beautifully crafted novel set in a country that is in the process of being destroyed. It is about the power of reading, the price of betrayal, and the possibility of redemption; and an exploration of the power of fathers over sons—their love, their sacrifices, their lies.",
      category: ["Fiction", "Historical Fiction", "Contemporary"],
      year: 2003,
      publisher: "Riverhead Books",
      pages: 371,
      isbn: "9781594631931",
      available: false,
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
      rating: 4.7,
      reviews: 62,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg",
        },
        {
          id: 19,
          title: "Where the Crawdads Sing",
          author: "Delia Owens",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crawdads.jpg-HY13jW0YwxCS8fnTa1SoxM5YVwVQs4.jpeg",
        },
        {
          id: 18,
          title: "Educated",
          author: "Tara Westover",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/educated.jpg-U7X5EJRbHtyOdrI9WF3soSk1R71K2t.jpeg",
        },
        {
          id: 5,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBkKKTa2chPfCDMXQ5K.webp",
        },
      ],
    },
    {
      id: 16,
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      description:
        "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions. Drawing on insights from biology, anthropology, paleontology, and economics, he explores how the currents of history have shaped our human societies, the animals and plants around us, and even our personalities.",
      category: ["Non-Fiction", "History", "Science"],
      year: 2014,
      publisher: "Harper",
      pages: 443,
      isbn: "9780062316097",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sapiens.jpg-ItXFyAl9oyz2umtP9Webab9hvk2yI4.jpeg",
      rating: 4.6,
      reviews: 59,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 20,
          title: "Atomic Habits",
          author: "James Clear",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atomic.jpg-h6sGpx1p3GBkYqghcq8Qbh883o6N1i.jpeg",
        },
        {
          id: 18,
          title: "Educated",
          author: "Tara Westover",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/educated.jpg-U7X5EJRbHtyOdrI9WF3soSk1R71K2t.jpeg",
        },
        {
          id: 10,
          title: "The Alchemist",
          author: "Paulo Coelho",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alchemist.jpg-9apmKdvYqAcuS8vsbFKxEpbCw5IWJL.jpeg",
        },
        {
          id: 14,
          title: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crime.jpg-vbXK5YpDaUnLEuczrCintOgqFdpC92.jpeg",
        },
      ],
    },
    {
      id: 17,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      description:
        "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
      category: ["Thriller", "Mystery", "Psychological Fiction"],
      year: 2019,
      publisher: "Celadon Books",
      pages: 325,
      isbn: "9781250301697",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/patient.jpg-8rdci0vLXPYo3BC1plHvUNH2AQdN9m.jpeg",
      rating: 4.5,
      reviews: 54,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 9,
          title: "The Da Vinci Code",
          author: "Dan Brown",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vinci.jpg-3LiOHvgd18gtOQJqX7Daa8NPce7Ote.jpeg",
        },
        {
          id: 19,
          title: "Where the Crawdads Sing",
          author: "Delia Owens",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crawdads.jpg-HY13jW0YwxCS8fnTa1SoxM5YVwVQs4.jpeg",
        },
        {
          id: 15,
          title: "The Kite Runner",
          author: "Khaled Hosseini",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
        },
      ],
    },
    {
      id: 18,
      title: "Educated",
      author: "Tara Westover",
      description:
        "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when one of Tara's older brothers became violent. When another brother got himself into college, Tara decided to try a new kind of life.",
      category: ["Biography", "Memoir", "Non-Fiction"],
      year: 2018,
      publisher: "Random House",
      pages: 334,
      isbn: "9780399590504",
      available: false,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/educated.jpg-U7X5EJRbHtyOdrI9WF3soSk1R71K2t.jpeg",
      rating: 4.7,
      reviews: 61,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 16,
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sapiens.jpg-ItXFyAl9oyz2umtP9Webab9hvk2yI4.jpeg",
        },
        {
          id: 15,
          title: "The Kite Runner",
          author: "Khaled Hosseini",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
        },
        {
          id: 5,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBkKKTa2chPfCDMXQ5K.webp",
        },
        {
          id: 20,
          title: "Atomic Habits",
          author: "James Clear",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atomic.jpg-h6sGpx1p3GBkYqghcq8Qbh883o6N1i.jpeg",
        },
      ],
    },
    {
      id: 19,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      description:
        "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say. Sensitive and intelligent, she has survived for years alone in the marsh that she calls home, finding friends in the gulls and lessons in the sand.",
      category: ["Fiction", "Mystery", "Coming of Age"],
      year: 2018,
      publisher: "G.P. Putnam's Sons",
      pages: 368,
      isbn: "9780735219090",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crawdads.jpg-HY13jW0YwxCS8fnTa1SoxM5YVwVQs4.jpeg",
      rating: 4.8,
      reviews: 67,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 15,
          title: "The Kite Runner",
          author: "Khaled Hosseini",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
        },
        {
          id: 17,
          title: "The Silent Patient",
          author: "Alex Michaelides",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/patient.jpg-8rdci0vLXPYo3BC1plHvUNH2AQdN9m.jpeg",
        },
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg",
        },
        {
          id: 4,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pride.jpg-bZSoXiOwfQ1VzAER23J95PeBfEblmp.jpeg",
        },
      ],
    },
    {
      id: 20,
      title: "Atomic Habits",
      author: "James Clear",
      description:
        "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
      category: ["Self-Help", "Psychology", "Non-Fiction"],
      year: 2018,
      publisher: "Avery",
      pages: 320,
      isbn: "9780735211292",
      available: true,
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atomic.jpg-h6sGpx1p3GBkYqghcq8Qbh883o6N1i.jpeg",
      rating: 4.8,
      reviews: 72,
      branches: [
        { id: 1, name: "Central Library", available: true },
        { id: 2, name: "North Branch", available: false },
        { id: 3, name: "East Branch", available: true },
      ],
      similarBooks: [
        {
          id: 16,
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sapiens.jpg-ItXFyAl9oyz2umtP9Webab9hvk2yI4.jpeg",
        },
        {
          id: 18,
          title: "Educated",
          author: "Tara Westover",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/educated.jpg-U7X5EJRbHtyOdrI9WF3soSk1R71K2t.jpeg",
        },
        {
          id: 10,
          title: "The Alchemist",
          author: "Paulo Coelho",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alchemist.jpg-9apmKdvYqAcuS8vsbFKxEpbCw5IWJL.jpeg",
        },
        {
          id: 15,
          title: "The Kite Runner",
          author: "Khaled Hosseini",
          coverUrl:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
        },
      ],
    },
  ]

  // Find the book by ID
  const book = books.find((b) => b.id === bookId)

  // If book is found, return it, otherwise generate a default book
  if (book) {
    return book
  }

  // Default book data for IDs not in our collection
  return {
    id: bookId,
    title: `Book Title ${bookId}`,
    author: `Author Name ${(bookId % 5) + 1}`,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    category: ["Fiction", "Adventure", "Mystery"],
    year: 2020,
    publisher: "Publisher Name",
    pages: 320,
    isbn: `978-1-23456-789-${bookId}`,
    available: bookId % 3 !== 0,
    coverUrl: `/placeholder.svg?height=600&width=400&query=book+cover+${bookId}`,
    rating: 4.5,
    reviews: 28,
    branches: [
      { id: 1, name: "Central Library", available: true },
      { id: 2, name: "North Branch", available: false },
      { id: 3, name: "East Branch", available: true },
    ],
    similarBooks: [1, 2, 3, 4].map((i) => ({
      id: (bookId + i) % 20 || 20, // Ensure IDs are between 1-20
      title: books[(bookId + i - 1) % books.length]?.title || `Similar Book ${bookId + i}`,
      author: books[(bookId + i - 1) % books.length]?.author || `Author ${i}`,
      coverUrl:
        books[(bookId + i - 1) % books.length]?.coverUrl ||
        `/placeholder.svg?height=300&width=200&query=book+cover+${bookId + i}`,
    })),
  }
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = getBookData(params.id)
  const [isLoading, setIsLoading] = useState(false)
  const [borrowingStatus, setBorrowingStatus] = useState<"available" | "borrowed" | "unavailable">(
    book.available ? "available" : "unavailable",
  )

  // Check if the user has already borrowed this book
  useEffect(() => {
    const checkBorrowStatus = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}/status`)
        if (response.ok) {
          const data = await response.json()
          if (data.status === "borrowed") {
            setBorrowingStatus("borrowed")
          }
        }
      } catch (error) {
        console.error("Failed to check borrowing status:", error)
      }
    }

    checkBorrowStatus()
  }, [params.id])

  // Add state for subscription status
  const [subscriptionStatus, setSubscriptionStatus] = useState<"active" | "cancelled" | "unknown">("unknown")

  // Add useEffect to check subscription status
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        // Add cache-busting query parameter to prevent caching
        const response = await fetch("/api/user/subscription?t=" + new Date().getTime())
        if (response.ok) {
          const data = await response.json()
          if (data.subscription) {
            setSubscriptionStatus(data.subscription.status)
          }
        }
      } catch (error) {
        console.error("Failed to check subscription status:", error)
      }
    }

    checkSubscriptionStatus()
  }, [])

  // Modify the handleBorrow function to handle subscription errors
  const handleBorrow = async () => {
    setIsLoading(true)

    try {
      console.log("Attempting to borrow book:", book.id)

      const response = await fetch("/api/books/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book.id,
          branchId: 1, // Default to Central Library
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.subscriptionRequired) {
          // Subscription error - update local state
          setSubscriptionStatus("cancelled")
        }
        throw new Error(data.error || "Failed to borrow book")
      }

      setBorrowingStatus("borrowed")
      toast({
        title: "Success",
        description: `You have borrowed "${book.title}"`,
      })
    } catch (error: any) {
      console.error("Borrow error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to borrow book",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReturn = async () => {
    setIsLoading(true)

    try {
      // First get the borrowing ID
      const borrowingsResponse = await fetch("/api/user/borrowings?status=borrowed")
      if (!borrowingsResponse.ok) {
        throw new Error("Failed to fetch borrowings")
      }

      const borrowingsData = await borrowingsResponse.json()
      const borrowing = borrowingsData.borrowings.find((b: any) => b.book_id === book.id)

      if (!borrowing) {
        throw new Error("Borrowing record not found")
      }

      // Now return the book
      const response = await fetch("/api/books/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          borrowingId: borrowing.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to return book")
      }

      setBorrowingStatus("available")
      toast({
        title: "Success",
        description: `You have returned "${book.title}"`,
      })
    } catch (error: any) {
      console.error("Return error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to return book",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle checkout redirect
  const handleCheckout = () => {
    // Redirect to checkout page with return URL back to this book
    window.location.href = `/checkout/subscription?plan=premium-monthly&returnUrl=${encodeURIComponent(`/catalog/${params.id}`)}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/catalog" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden border bg-gray-50 aspect-[2/3]">
              <img
                src={book.coverUrl || "/placeholder.svg"}
                alt={book.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = "/abstract-book-cover.png"
                }}
              />
            </div>

            <div className="mt-4 space-y-4">
              {borrowingStatus === "available" && (
                <>
                  {subscriptionStatus === "cancelled" ? (
                    <div className="space-y-3">
                      <Button className="w-full" variant="outline" disabled={true}>
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Subscription Required
                        </span>
                      </Button>
                      <Button className="w-full" onClick={handleCheckout}>
                        <span className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Subscribe to Borrow
                        </span>
                      </Button>
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-md">
                        <p className="text-sm text-amber-800">
                          Your membership has been discontinued. Please renew your subscription to borrow books.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full" disabled={isLoading} onClick={handleBorrow}>
                      {isLoading ? (
                        <span className="flex items-center">
                          <Clock className="animate-spin h-4 w-4 mr-2" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Borrow Book
                        </span>
                      )}
                    </Button>
                  )}
                </>
              )}

              {borrowingStatus === "borrowed" && (
                <Button className="w-full" variant="secondary" disabled={isLoading} onClick={handleReturn}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <Clock className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Return Book
                    </span>
                  )}
                </Button>
              )}

              {borrowingStatus === "unavailable" && (
                <Button className="w-full" disabled={true}>
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Unavailable
                  </span>
                </Button>
              )}

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-3">Availability by Branch</h3>
                  <div className="space-y-2">
                    {book.branches.map((branch) => (
                      <div key={branch.id} className="flex justify-between items-center text-sm">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                          {branch.name}
                        </span>
                        <Badge variant={branch.available ? "default" : "outline"}>
                          {branch.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-4">by {book.author}</p>

            <div className="flex items-center mb-6 space-x-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(book.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{book.rating}</span>
                <span className="ml-1 text-sm text-gray-500">({book.reviews} reviews)</span>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {book.year}
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {book.pages} pages
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {book.category.map((cat, index) => (
                  <Badge key={index} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>

              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Publisher</h3>
                      <p>{book.publisher}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Publication Year</h3>
                      <p>{book.year}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">ISBN</h3>
                      <p>{book.isbn}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Pages</h3>
                      <p>{book.pages}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-4">
                    {/* This would be populated with actual reviews */}
                    <p className="text-gray-500 italic">Reviews would be displayed here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Similar Books */}
            <div>
              <h2 className="text-xl font-semibold mb-4">You might also like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {book.similarBooks.map((similarBook) => (
                  <Link href={`/catalog/${similarBook.id}`} key={similarBook.id} className="group">
                    <div className="border rounded-lg overflow-hidden transition-all group-hover:shadow-md">
                      <div className="aspect-[2/3] bg-gray-100">
                        <img
                          src={similarBook.coverUrl || "/placeholder.svg"}
                          alt={similarBook.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.src = "/abstract-book-cover.png"
                          }}
                        />
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                          {similarBook.title}
                        </h3>
                        <p className="text-xs text-gray-500">{similarBook.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
