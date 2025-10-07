import { useQuery } from '@tanstack/react-query';
import { Book } from '../types';

export const useCatalog = () => {
  // Use React Query for efficient data fetching and caching
  const {
    data: catalog = [],
    isLoading,
    error,
    refetch
  } = useQuery<Book[]>({
    queryKey: ['catalog'],
    queryFn: async () => {
      try {
        const response = await fetch('/data/catalog.json');
        if (!response.ok) {
          throw new Error('Failed to load catalog');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        // Fallback to a minimal catalog for demo purposes
        return getFallbackCatalog();
      }
    },
    staleTime: Infinity, // Catalog doesn't change often
    retry: 2,
  });

  // Search function
  const searchBooks = (query: string): Book[] => {
    const searchTerm = query.toLowerCase();
    return catalog.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.subjects.some(subject => subject.toLowerCase().includes(searchTerm)) ||
      book.description.toLowerCase().includes(searchTerm)
    );
  };

  // Filter by format availability
  const filterByFormat = (format: 'physical' | 'ebook' | 'audiobook'): Book[] => {
    return catalog.filter(book =>
      book.formats.some(f => f.type === format && f.status === 'available')
    );
  };

  // Get popular books
  const getPopularBooks = (limit: number = 10): Book[] => {
    return catalog
      .filter(book => book.popular === true)
      .slice(0, limit);
  };

  // Get books by subject/genre
  const getBooksBySubject = (subject: string): Book[] => {
    return catalog.filter(book =>
      book.subjects.includes(subject.toLowerCase())
    );
  };

  return {
    catalog,
    isLoading,
    error: error as Error | null,
    refetch,
    searchBooks,
    filterByFormat,
    getPopularBooks,
    getBooksBySubject
  };
};

// Fallback catalog data in case the JSON file fails to load
const getFallbackCatalog = (): Book[] => {
  return [
    {
      id: 'fallback-1',
      isbn: '9780735219090',
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      cover: 'https://via.placeholder.com/150x225/4F46E5/FFFFFF?text=Crawdads',
      formats: [
        { type: 'physical', status: 'available', copies_available: 3 },
        { type: 'ebook', status: 'waitlist', wait_time: '2 weeks' },
        { type: 'audiobook', status: 'available' }
      ],
      subjects: ['fiction', 'mystery', 'nature', 'coming-of-age'],
      description: 'A woman who raised herself in the marshes of North Carolina becomes a suspect in the murder of a man she was once involved with.',
      publication_year: 2018,
      pages: 384,
      rating: 4.5,
      popular: true
    },
    {
      id: 'fallback-2',
      isbn: '9781250178619',
      title: 'The Thursday Murder Club',
      author: 'Richard Osman',
      cover: 'https://via.placeholder.com/150x225/7C3AED/FFFFFF?text=Thursday',
      formats: [
        { type: 'physical', status: 'available', copies_available: 2 },
        { type: 'ebook', status: 'available' }
      ],
      subjects: ['mystery', 'humor', 'seniors', 'british'],
      description: 'Four retirees at a British retirement home form a club to solve cold cases, but find themselves involved in a present-day murder.',
      publication_year: 2020,
      pages: 368,
      rating: 4.3,
      popular: true
    },
    {
      id: 'fallback-3',
      isbn: '9780399590504',
      title: 'Educated',
      author: 'Tara Westover',
      cover: 'https://via.placeholder.com/150x225/DC2626/FFFFFF?text=Educated',
      formats: [
        { type: 'physical', status: 'checked_out', due_date: '2025-10-20' },
        { type: 'ebook', status: 'available' },
        { type: 'audiobook', status: 'available' }
      ],
      subjects: ['memoir', 'education', 'family', 'non-fiction'],
      description: 'A memoir about a young woman who leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
      publication_year: 2018,
      pages: 334,
      rating: 4.7,
      popular: true
    },
    {
      id: 'fallback-4',
      isbn: '9780385547345',
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      cover: 'https://via.placeholder.com/150x225/059669/FFFFFF?text=Silent',
      formats: [
        { type: 'physical', status: 'available', copies_available: 5 },
        { type: 'ebook', status: 'available' }
      ],
      subjects: ['thriller', 'mystery', 'psychological', 'fiction'],
      description: 'A woman shoots her husband and then never speaks again. A psychotherapist becomes obsessed with uncovering the truth.',
      publication_year: 2019,
      pages: 336,
      rating: 4.2,
      popular: false
    },
    {
      id: 'fallback-5',
      isbn: '9780525559474',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      cover: 'https://via.placeholder.com/150x225/0891B2/FFFFFF?text=Midnight',
      formats: [
        { type: 'physical', status: 'waitlist', wait_time: '1 week', holds: 8 },
        { type: 'ebook', status: 'available' },
        { type: 'audiobook', status: 'available' }
      ],
      subjects: ['fiction', 'fantasy', 'philosophy', 'mental-health'],
      description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a life you could have lived.',
      publication_year: 2020,
      pages: 288,
      rating: 4.1,
      popular: true
    }
  ];
};