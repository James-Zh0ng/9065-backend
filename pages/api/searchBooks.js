import axios from 'axios';
import unifiedCorsMiddleware from '../../utils/cors'; // Adjust this import path as needed

// Asynchronous function to fetch books
async function fetchBooks(query) {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching books:', error.message);
    throw error;
  }
}

// Handler function for processing requests
const handler = async (req, res) => {
  const { searchTerm, category } = req.query;
  try {
    let query = category ? `subject:${category}` : searchTerm;
    console.log(`Searching books for query: ${query}`);

    const items = await fetchBooks(query);

    const filteredBooks = items.filter(book => book.saleInfo && book.saleInfo.listPrice).map(book => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : null,
      description: book.volumeInfo.description,
      price: book.saleInfo.listPrice.amount,
      currencyCode: book.saleInfo.listPrice.currencyCode
    }));

    res.json(filteredBooks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
}

// Apply the unified CORS middleware to the handler
export default unifiedCorsMiddleware(handler);
