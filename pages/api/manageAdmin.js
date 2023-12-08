// pages/api/manageAdmin.js
import firebaseAdmin from '../../utils/firebaseAdmin';
import cors from 'cors'; // Import the cors middleware

export default async function handler(req, res) {
  await cors()(req, res, async () => { // Apply the cors middleware
    if (req.method === 'POST') {
      // Get the email and action (add or remove) from the request body
      const { email, action } = req.body;
      if (!email || !action) {
        return res.status(400).json({ error: 'Email and action are required' });
      }

      try {
        // Retrieve UID using email
        const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
        const uid = userRecord.uid;

        // Reference to the admin node in Firebase
        const adminRef = firebaseAdmin.database().ref(`admin/${uid}`);

        if (action === 'add') {
          // Add UID to admin list
          await adminRef.set(true);
        } else if (action === 'remove') {
          // Remove UID from admin list
          await adminRef.remove();
        } else {
          return res.status(400).json({ error: 'Invalid action' });
        }

        return res.status(200).json({ message: `User ${action === 'add' ? 'added to' : 'removed from'} admin list` });
      } catch (error) {
        console.error('Error managing admin status:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  });
}
