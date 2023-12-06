import axios from 'axios';
import Cors from 'cors';

// Initializing the cors middleware with specific origin
const cors = Cors({
  methods: ['GET', 'HEAD'],
  origin: 'http://localhost:3001', // Specify the client origin
});

// Helper method to initialize CORS and handle errors
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

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

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

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
