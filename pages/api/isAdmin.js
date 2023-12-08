// pages/api/isAdmin.js
import firebaseAdmin from '../../utils/firebaseAdmin';
import cors from 'cors'; // Import the cors middleware

export default async function handler(req, res) {
  await cors()(req, res, async () => { // Apply the cors middleware
    if (req.method === 'GET') {
      // Get the UID or email from the request query
      let { uid, email } = req.query;

      if (!uid) {
        if (!email) {
          return res.status(400).json({ error: 'UID or email is required' });
        }
        // Retrieve UID using email
        try {
          const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
          uid = userRecord.uid;
        } catch (error) {
          console.error('Error retrieving user by email:', error);
          return res.status(500).json({ error: 'Error retrieving UID by email' });
        }
      }

      // Check if the UID provided is for an admin
      try {
        const adminRef = firebaseAdmin.database().ref(`admin/${uid}`);
        const snapshot = await adminRef.once('value');
        const isAdmin = snapshot.exists() && snapshot.val() === true;

        return res.status(200).json({ isAdmin });
      } catch (error) {
        console.error('Error checking admin status:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
