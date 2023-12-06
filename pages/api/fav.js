import admin from '../../utils/firebaseAdmin';
import cors from 'cors';
import verifyToken from '../../utils/verifyToken'; // Import the middleware

// Utility function to update the entire favorites list
export const updateFavorites = async (userId, favoritesList) => {
    const db = admin.database();
    try {
      // Directly set the favoritesList as the value for the userId key
      await db.ref(`favorites/${userId}`).set(favoritesList);
  
      return { message: 'Favorites updated' };
    } catch (error) {
      console.error('Error updating favorites:', error);
      throw error;
    }
};

// Utility function to get a user's favorites list
export const getFavorites = async (userId) => {
  const db = admin.database();
  try {
    const snapshot = await db.ref(`favorites/${userId}`).once('value');
    return snapshot.val() || []; // Return the favorites list or an empty array if not found
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export default async function handler(req, res) {
    await cors()(req, res, async () => {
      await verifyToken(req, res, async () => { // Applying the middleware
        if (req.method !== 'POST' && req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
  
        try {
          const userId = req.user.uid; // Extract userId from verified token
  
          if (req.method === 'POST') {
            const { favorites } = req.body;
            await updateFavorites(userId, favorites);
            res.status(200).json({ message: 'Favorites updated successfully' });
          } else if (req.method === 'GET') {
            const favoritesList = await getFavorites(userId);
            res.status(200).json({ favorites: favoritesList });
          }
        } catch (error) {
          res.status(401).json({ error: error.message });
        }
      });
    });
  }