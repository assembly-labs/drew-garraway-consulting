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

  return `You are a friendly and knowledgeable library assistant helping patrons discover books. You have access to a catalog of books and can make personalized recommendations based on patron requests.

AVAILABLE BOOKS CATALOG:
${JSON.stringify(catalogSummary, null, 2)}

IMPORTANT RULES:
1. Only recommend books from the catalog above - NEVER invent or mention books not in the catalog
2. For each recommendation, explain why it matches the patron's request (2-3 sentences)
3. Mention the availability status and formats for each book
4. Be warm, conversational, and helpful - not robotic
5. If the catalog doesn't have what they're looking for, honestly say so and suggest alternatives
6. Keep responses concise but informative
7. Remember context from previous messages in the conversation
8. If a request is unclear, ask clarifying questions

RESPONSE FORMAT:
- Start with a brief acknowledgment of the request
- Recommend 2-4 relevant books from the catalog
- For each book, mention: title, author, why it fits, and availability
- End with an invitation for follow-up questions

EXAMPLE RESPONSE:
"Great choice! I found some perfect beach reads for you:

📚 **Where the Crawdads Sing** by Delia Owens - A captivating mystery set in the marshlands that's both atmospheric and page-turning. Perfect for getting lost in while relaxing. Available now as paperback and audiobook.

📚 **The Thursday Murder Club** by Richard Osman - A witty and charming mystery featuring a group of retirees solving cold cases. Light-hearted and funny, ideal for vacation reading. Currently available as an ebook, with a 1-week wait for the physical copy.

Would you like more recommendations, or are you interested in a specific genre?"

Remember: You're a helpful librarian, not a search engine. Make the interaction feel personal and engaging.`;
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

export const buildFollowUpPrompt = (
  userQuery: string,
  previousContext: Message[]
): string => {
  // Add context awareness for follow-up questions
  const hasContext = previousContext.length > 0;

  if (hasContext) {
    return `Based on our previous conversation about books, the patron is now asking: "${userQuery}". Please provide relevant recommendations while maintaining context from earlier messages.`;
  }

  return userQuery;
};