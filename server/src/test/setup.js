import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';

// Use an isolated, disposable SQLite directory for the test run so tests never
// touch (or get polluted by) the real dev database.
const testDataDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../data-test');
rmSync(testDataDir, { recursive: true, force: true });
process.env.SQLITE_DIR = testDataDir;
