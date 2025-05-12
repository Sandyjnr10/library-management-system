import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"

export default function BooksList() {
  // Comprehensive list of all books in the system with updated cover images
  const ALL_BOOKS = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      year: 1925,
      category: "Fiction",
      coverUrl: "/placeholder.svg?key=o865m",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      year: 1960,
      category: "Fiction",
      coverUrl: "/placeholder.svg?key=78ihw",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      year: 1949,
      category: "Science Fiction",
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1984-georgeowell-ZFFsRav5E9OxPCEBiTPXojbOgXrH0e.jpeg",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      year: 1813,
      category: "Romance",
      coverUrl: "/placeholder.svg?key=1ip5c",
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      year: 1951,
      category: "Fiction",
      coverUrl: "/placeholder.svg?key=lz0zq",
    },
    {
      id: 6,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      year: 1937,
      category: "Fantasy",
      coverUrl: "/placeholder.svg?key=4hxl2",
    },
    {
      id: 7,
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      year: 1997,
      category: "Fantasy",
      coverUrl: "/placeholder.svg?key=izy3m",
    },
    {
      id: 8,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      year: 1954,
      category: "Fantasy",
      coverUrl: "/placeholder.svg?key=z61qz",
    },
    {
      id: 9,
      title: "The Da Vinci Code",
      author: "Dan Brown",
      year: 2003,
      category: "Mystery",
      coverUrl: "/placeholder.svg?key=bsrjs",
    },
    {
      id: 10,
      title: "The Alchemist",
      author: "Paulo Coelho",
      year: 1988,
      category: "Fiction",
      coverUrl: "/placeholder.svg?key=wbcb4",
    },
    {
      id: 11,
      title: "The Hunger Games",
      author: "Suzanne Collins",
      year: 2008,
      category: "Science Fiction",
      coverUrl: "/placeholder.svg?key=sj4mc",
    },
    {
      id: 12,
      title: "Brave New World",
      author: "Aldous Huxley",
      year: 1932,
      category: "Science Fiction",
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/world.jpg-CSZ1duVkKpWviTOUE0EVGNm4eeLiDG.jpeg",
    },
    {
      id: 13,
      title: "The Odyssey",
      author: "Homer",
      year: -800,
      category: "Classics",
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/odyssey.jpg-sl8Oh5adj1Wn5O0WNB85hYtLdwrCgQ.jpeg",
    },
    {
      id: 14,
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      year: 1866,
      category: "Classics",
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crime.jpg-vbXK5YpDaUnLEuczrCintOgqFdpC92.jpeg",
    },
    {
      id: 15,
      title: "The Kite Runner",
      author: "Khaled Hosseini",
      year: 2003,
      category: "Fiction",
      coverUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kite.jpg-0ueuvtGMOYS5DisArOzcQECnSYCtpb.jpeg",
    },
    {
      id: 16,
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      year: 2014,
      category: "Non-Fiction",
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sapiens.jpg-ItXFyAl9oyz2umtP9Webab9hvk2yI4.jpeg",
    },
    {
      id: 17,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      year: 2019,
      category: "Thriller",
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/patient.jpg-8rdci0vLXPYo3BC1plHvUNH2AQdN9m.jpeg",
    },
    {
      id: 18,
      title: "Educated",
      author: "Tara Westover",
      year: 2018,
      category: "Biography",
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/educated.jpg-U7X5EJRbHtyOdrI9WF3soSk1R71K2t.jpeg",
    },
    {
      id: 19,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      year: 2018,
      category: "Fiction",
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crawdads.jpg-HY13jW0YwxCS8fnTa1SoxM5YVwVQs4.jpeg",
    },
    {
      id: 20,
      title: "Atomic Habits",
      author: "James Clear",
      year: 2018,
      category: "Self-Help",
      coverUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atomic.jpg-h6sGpx1p3GBkYqghcq8Qbh883o6N1i.jpeg",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/catalog" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Complete Book List</h1>
        <div className="text-sm text-gray-500">Total: {ALL_BOOKS.length} books</div>
      </div>

      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cover
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Author
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Year
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ALL_BOOKS.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-8 overflow-hidden rounded border">
                    <img
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{book.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{book.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.year}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {book.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/catalog/${book.id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 mb-4">
          This is a complete list of all books available in the Advanced Media Library system.
        </p>
        <Button asChild>
          <Link href="/catalog" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Catalog
          </Link>
        </Button>
      </div>
    </div>
  )
}
