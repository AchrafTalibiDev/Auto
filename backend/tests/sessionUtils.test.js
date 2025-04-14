import fs from 'fs';
import path from 'path';
import {deleteSession } from '../utils/sessionUtils.js';

describe('deleteSession', () => {
    const email = 'test@example.com';
    const sessionPath = path.join(process.cwd(), 'sessions', email.replace(/[@.]/g, '_'));

    beforeAll(() => {
        fs.mkdirSync(sessionPath, { recursive: true });
        fs.writeFileSync(path.join(sessionPath, 'dummy.json'), JSON.stringify({ test: true }));
    });

    it('supprime le dossier de session existant', () => {
        deleteSession(email);
        expect(fs.existsSync(sessionPath)).toBe(false);
    });
});