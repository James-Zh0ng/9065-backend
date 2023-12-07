import admin from '../../utils/firebaseAdmin';
import cors from 'cors';

// Utility function to get all user's email addresses
const getAllUsersEmails = async () => {
  const allUsers = [];
  const listAllUsers = async (nextPageToken) => {
    // List batch of users, 1000 at a time.
    await admin.auth().listUsers(1000, nextPageToken)
      .then(async (listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          allUsers.push(userRecord.email); // Assuming all users have an email.
        });
        if (listUsersResult.pageToken) {
          // If more results are available, recursively call this function to fetch them.
          await listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.error('Error listing users:', error);
        throw error;
      });
  };
  await listAllUsers(); // Start listing users from the beginning, with no page token.
  return allUsers;
};

export default async function handler(req, res) {
  await cors()(req, res, async () => {
    if (req.method === 'GET') {
      try {
        const usersEmails = await getAllUsersEmails();
        res.status(200).json({ usersEmails });
      } catch (error) {
        console.error('Error fetching user emails:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
