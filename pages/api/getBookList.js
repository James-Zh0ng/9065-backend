// ... (other imports)
import admin from '../../utils/firebaseAdmin';
import cors from 'cors';

// Utility function to get a public book list by user's email
const getPublicBookListByEmail = async (email) => {
  const db = admin.database();
  try {
    // Find user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;
    // Fetch the public book list
    const snapshot = await db.ref(`bookLists/${userId}`).once('value');
    const bookLists = snapshot.val() || [];
    // Filter out the private book lists
    return bookLists.filter(bookList => bookList.isPublic);
  } catch (error) {
    console.error('Error fetching public book list by email:', error);
    throw error;
  }
};

export default async function getBookListHandler(req, res) {
  await cors()(req, res, async () => {
    if (req.method === 'GET') {
      try {
        const { email } = req.query;
        const publicBookList = await getPublicBookListByEmail(email);
        res.status(200).json({ publicBookList });
      } catch (error) {
        console.error('Error fetching public book list:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
