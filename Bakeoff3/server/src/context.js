import { auth } from './firebase.js';
import { syncUserFromFirebase } from './lessonService.js';

export async function createContext({ req }) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return { user: null, viewerUserId: null };
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    const user = await syncUserFromFirebase(decoded);
    return { user, viewerUserId: user.id, firebaseUid: decoded.uid };
  } catch (err) {
    console.error('[auth] token verify failed:', err?.message);
    return { user: null, viewerUserId: null };
  }
}
