import admin from '../../utils/firebaseAdmin';
import cors from 'cors';
import verifyToken from '../../utils/verifyToken';

// Utility function to save book lists
const saveBookLists = async (userId, bookLists) => {
    console.log(userId, bookLists)
  const db = admin.database();
  try {
    await db.ref(`bookLists/${userId}`).set(bookLists);
    return { message: 'Book lists saved successfully' };
  } catch (error) {
    console.error('Error saving book lists:', error);
    throw error;
  }
};

// Utility function to get book lists
const getBookLists = async (userId) => {
  const db = admin.database();
  try {
    const snapshot = await db.ref(`bookLists/${userId}`).once('value');
    return snapshot.val() || [];
  } catch (error) {
    console.error('Error fetching book lists:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  await cors()(req, res, async () => {
    await verifyToken(req, res, async () => {
      const userId = req.user.uid;
      if (req.method === 'POST') {
        const  bookLists  = req.body;
        await saveBookLists(userId, bookLists);
        res.status(200).json({ message: 'Book lists saved successfully' });
      } else if (req.method === 'GET') {
        const bookLists = await getBookLists(userId);
        res.status(200).json({ bookLists });
      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }
    });
  });
}
