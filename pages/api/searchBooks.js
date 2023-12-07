import axios from 'axios';
import Cors from 'cors';

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

// Initialize CORS with options
const corsOptions = {
  origin: '*', // This should be more restrictive in production
  methods: ['GET', 'HEAD', 'POST'], // Specify allowed methods
};

// Middleware for CORS
function allowCors(fn) {
  return async function(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    return await fn(req, res);
  }
}

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

export default allowCors(handler);
