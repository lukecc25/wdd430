import 'dotenv/config';
import { ensureSeeded } from './lessonService.js';

await ensureSeeded();
console.log('[seed] done');
process.exit(0);
