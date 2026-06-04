import { db } from './firebase.js';
import { lessonSeed } from './data/lessonSeed.js';
import { gradeAttempt } from './gradeAttempt.js';
import { gqlError } from './errors.js';

const lessonsCol = () => db.collection('lessons');
const usersCol = () => db.collection('users');
const attemptsCol = () => db.collection('attempts');

function stripAnswers(lesson) {
  return {
    ...lesson,
    questions: lesson.questions.map(({ correctIndex, explanation, points, ...rest }) => rest),
  };
}

function serializeListItem(doc) {
  const d = doc.data();
  return {
    id: doc.id,
    slug: d.slug,
    title: d.title,
    description: d.description || '',
    difficulty: d.difficulty,
    isOfficial: Boolean(d.isOfficial),
    visibility: d.visibility || 'public',
    authorName: d.authorName || '',
    isCommunity: !d.isOfficial && d.visibility === 'public',
  };
}

function canViewLesson(lesson, viewerUserId) {
  if (!lesson) return false;
  if (lesson.isOfficial || !lesson.createdBy) return true;
  if (lesson.visibility === 'public') return true;
  if (!viewerUserId) return false;
  return lesson.createdBy === viewerUserId;
}

export async function ensureSeeded() {
  const snap = await lessonsCol().where('isOfficial', '==', true).limit(1).get();
  if (!snap.empty) return;

  const batch = db.batch();
  for (const lesson of lessonSeed) {
    const ref = lessonsCol().doc();
    batch.set(ref, {
      ...lesson,
      isOfficial: true,
      visibility: 'public',
      createdBy: null,
      createdAt: new Date(),
    });
  }
  await batch.commit();
  console.log('[firebase] seeded official lessons');
}

async function findLessonDoc(lessonId) {
  let doc = await lessonsCol().doc(lessonId).get();
  if (doc.exists) return doc;
  const bySlug = await lessonsCol().where('slug', '==', lessonId).limit(1).get();
  return bySlug.docs[0] || null;
}

export async function getUserByFirebaseUid(firebaseUid) {
  const snap = await usersCol().where('firebaseUid', '==', firebaseUid).limit(1).get();
  return snap.docs[0] || null;
}

export async function syncUserFromFirebase(decoded) {
  const existing = await getUserByFirebaseUid(decoded.uid);
  if (existing) return { id: existing.id, ...existing.data() };

  const ref = usersCol().doc();
  const data = {
    firebaseUid: decoded.uid,
    email: decoded.email || '',
    firstName: decoded.name?.split(' ')[0] || '',
    lastName: decoded.name?.split(' ').slice(1).join(' ') || '',
    imageUrl: decoded.picture || '',
    totalScore: 0,
    createdAt: new Date(),
  };
  await ref.set(data);
  return { id: ref.id, ...data };
}

export async function getLessonsList(viewerUserId = null) {
  await ensureSeeded();

  const official = await lessonsCol().where('isOfficial', '==', true).get();
  const publicCustom = await lessonsCol()
    .where('isOfficial', '==', false)
    .where('visibility', '==', 'public')
    .get();

  let privateDocs = [];
  if (viewerUserId) {
    const priv = await lessonsCol()
      .where('createdBy', '==', viewerUserId)
      .where('visibility', '==', 'private')
      .get();
    privateDocs = priv.docs;
  }

  const all = [...official.docs, ...publicCustom.docs, ...privateDocs];
  const seen = new Set();
  const items = [];
  for (const doc of all) {
    if (seen.has(doc.id)) continue;
    seen.add(doc.id);
    items.push(serializeListItem(doc));
  }

  items.sort((a, b) => {
    if (a.isOfficial !== b.isOfficial) return a.isOfficial ? -1 : 1;
    return 0;
  });

  if (items.length === 0) {
    return lessonSeed.map(({ slug, title, description, difficulty }) => ({
      id: slug,
      slug,
      title,
      description,
      difficulty,
      isOfficial: true,
      visibility: 'public',
      authorName: '',
      isCommunity: false,
    }));
  }

  return items;
}

export async function getLessonForQuiz(lessonId, viewerUserId) {
  await ensureSeeded();
  const doc = await findLessonDoc(lessonId);
  if (!doc) {
    const seed = lessonSeed.find((l) => l.slug === lessonId);
    if (seed) {
      return stripAnswers({ id: seed.slug, ...seed, isOfficial: true });
    }
    return null;
  }

  const lesson = { id: doc.id, ...doc.data() };
  if (!canViewLesson(lesson, viewerUserId)) {
    gqlError('This lesson is private', 'FORBIDDEN');
  }
  return stripAnswers(lesson);
}

export async function getLessonForGrading(lessonId, viewerUserId) {
  await ensureSeeded();
  const doc = await findLessonDoc(lessonId);
  if (!doc) gqlError('Lesson not found', 'NOT_FOUND');

  const lesson = { id: doc.id, ...doc.data() };
  if (!canViewLesson(lesson, viewerUserId)) {
    gqlError('This lesson is private', 'FORBIDDEN');
  }
  return lesson;
}

export async function createUserLesson(user, input) {
  await ensureSeeded();
  const slug = `custom-${user.id}-${Date.now()}`;
  const authorName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Community chef';

  const ref = lessonsCol().doc();
  const data = {
    slug,
    title: input.title,
    description: input.description,
    lessonContent: input.lessonContent || input.description,
    difficulty: input.difficulty,
    questions: input.questions,
    createdBy: user.id,
    visibility: input.visibility,
    isOfficial: false,
    authorName,
    createdAt: new Date(),
  };
  await ref.set(data);
  return serializeListItem({ id: ref.id, data: () => data });
}

export async function submitAttempt(user, lessonId, answers) {
  const lesson = await getLessonForGrading(lessonId, user.id);
  const result = gradeAttempt(lesson, answers);

  const attemptRef = attemptsCol().doc();
  await attemptRef.set({
    userId: user.id,
    lessonId: lesson.id,
    answers,
    score: result.score,
    totalPossible: result.totalPossible,
    feedback: result.feedback,
    createdAt: new Date(),
  });

  const userRef = usersCol().doc(user.id);
  await userRef.update({
    totalScore: (user.totalScore || 0) + result.score,
  });

  return {
    attemptId: attemptRef.id,
    score: result.score,
    totalPossible: result.totalPossible,
    feedback: result.feedback,
  };
}

export async function getProgress(userId) {
  if (!userId) return [];

  const snap = await attemptsCol().where('userId', '==', userId).get();
  const best = new Map();

  for (const doc of snap.docs) {
    const d = doc.data();
    const key = d.lessonId;
    const prev = best.get(key);
    if (!prev || d.score > prev.score) {
      best.set(key, { lessonId: key, score: d.score, totalPossible: d.totalPossible });
    }
  }

  return [...best.values()];
}
