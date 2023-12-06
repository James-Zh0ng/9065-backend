import admin from '../../utils/firebaseAdmin';
import cors from 'cors';
import verifyToken from '../../utils/verifyToken'; // Import the middleware

// Utility function to update the user's cart items
export const updateCartItems = async (userId, cartItems) => {
  const db = admin.database();
  try {
    await db.ref(`cartItems/${userId}`).set(cartItems);
    return { message: 'Cart updated successfully' };
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Utility function to fetch the user's cart items
export const getCartItems = async (userId) => {
  const db = admin.database();
  try {
    const snapshot = await db.ref(`cartItems/${userId}`).once('value');
    return snapshot.val() || []; // Return the cart items list or an empty array if not found
  } catch (error) {
    console.error('Error fetching cart items:', error);
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
            const { cartItems } = req.body;
            await updateCartItems(userId, cartItems);
            res.status(200).json({ message: 'Cart updated successfully' });
          } else if (req.method === 'GET') {
            const cartItems = await getCartItems(userId);
            res.status(200).json({ cartItems });
          }
        } catch (error) {
          res.status(401).json({ error: error.message });
        }
      });
    });
  }