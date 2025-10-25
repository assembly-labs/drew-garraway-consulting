import { Book, Message } from '../types';

export const buildSystemPrompt = (catalog: Book[]): string => {
  // Create a condensed version of the catalog for the prompt
  const catalogSummary = catalog.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    subjects: book.subjects,
    description: book.description.substring(0, 100) + '...', // Truncate for context window
    formats: book.formats.map(f => ({
      type: f.type,
      status: f.status,
      wait_time: f.wait_time
    })),
    rating: book.rating,
    year: book.publication_year
  }));

  return `You are a friendly and knowledgeable library assistant. You can ONLY recommend books from the catalog provided below. Do NOT use any external knowledge or mention books not in this catalog.

COMPLETE LIBRARY CATALOG:
${JSON.stringify(catalogSummary, null, 2)}

CRITICAL RULES - FOLLOW THESE EXACTLY:
1. ONLY recommend books that are in the catalog above - DO NOT search the web or use external knowledge
2. DO NOT mention, suggest, or reference ANY books not explicitly listed in the catalog above
3. If you cannot find matching books in the catalog, say "I couldn't find books matching that in our catalog, but here are some similar options..." and suggest alternatives from the catalog
4. For each recommendation, explain why it matches (2-3 sentences)
5. Always mention availability status and formats
6. Be warm, conversational, and helpful
7. Keep responses concise (2-4 book recommendations maximum)

RESPONSE FORMAT:
- Acknowledge the request briefly
- Recommend 2-4 books from the catalog ONLY
- For each book: title, author, why it fits, availability
- End with invitation for questions

EXAMPLE RESPONSE:
"Great choice! I found some perfect beach reads for you from our library:

📚 **Where the Crawdads Sing** by Delia Owens - A captivating mystery set in the marshlands that's both atmospheric and page-turning. Perfect for getting lost in while relaxing. Available now as paperback and audiobook.

📚 **The Thursday Murder Club** by Richard Osman - A witty and charming mystery featuring a group of retirees solving cold cases. Light-hearted and funny, ideal for vacation reading. Currently available as an ebook, with a 1-week wait for the physical copy.

Would you like more recommendations from our collection?"

REMEMBER: You are working with a CLOSED catalog system. Use ONLY the books listed in the catalog above. NO exceptions.`;
};

export const formatConversationForAPI = (messages: Message[]): any[] => {
  // Convert our Message format to Claude's expected format
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
};

export const extractBookRecommendations = (
  response: string,
  catalog: Book[]
): Book[] => {
  // Extract book titles mentioned in the response with improved matching
  const recommendedBooks: Book[] = [];
  const responseNormalized = response.toLowerCase();

  // Create a Set to avoid duplicates
  const foundBookIds = new Set<string>();

  catalog.forEach(book => {
    // Skip if already found
    if (foundBookIds.has(book.id)) return;

    const titleNormalized = book.title.toLowerCase();
    const authorNormalized = book.author.toLowerCase();

    // Check multiple matching strategies
    const isMatched =
      // Exact title match
      responseNormalized.includes(titleNormalized) ||
      // Title without "The" prefix
      (titleNormalized.startsWith('the ') &&
       responseNormalized.includes(titleNormalized.substring(4))) ||
      // Title in quotes or bold
      responseNormalized.includes(`"${titleNormalized}"`) ||
      responseNormalized.includes(`**${titleNormalized}**`) ||
      // Title and author mentioned close together (within 50 chars)
      (responseNormalized.includes(titleNormalized.split(' ')[0]) &&
       responseNormalized.includes(authorNormalized) &&
       Math.abs(
         responseNormalized.indexOf(titleNormalized.split(' ')[0]) -
         responseNormalized.indexOf(authorNormalized)
       ) < 50) ||
      // ISBN match (if response contains ISBNs)
      responseNormalized.includes(book.isbn);

    if (isMatched) {
      foundBookIds.add(book.id);
      recommendedBooks.push(book);
    }
  });

  // Sort by order of appearance in response
  recommendedBooks.sort((a, b) => {
    const aIndex = responseNormalized.indexOf(a.title.toLowerCase());
    const bIndex = responseNormalized.indexOf(b.title.toLowerCase());
    return aIndex - bIndex;
  });

  // Limit to top 6 recommendations
  return recommendedBooks.slice(0, 6);
};