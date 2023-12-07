// pages/api/signup.js
import NextCors from 'nextjs-cors';
import admin from '../../utils/firebaseAdmin';

export default async function handler(req, res) {
  // Run the CORS middleware
  await NextCors(req, res, {
    methods: ['POST'],
    origin: ['http://localhost:3001'], // Adjust this to match your front-end origin
    optionsSuccessStatus: 200,
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    return res.status(200).json({ uid: userRecord.uid });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
