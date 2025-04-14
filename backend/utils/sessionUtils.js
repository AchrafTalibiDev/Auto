import fs from 'fs';
import path from 'path';

export const deleteSession = (email) => {

    const sessionPath = path.join(process.cwd(), 'sessions', email.replace(/[@.]/g, '_'));


    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true });
        console.log(`Session supprimée pour ${email}`);
    } else {
        console.log(`Aucune session trouvée pour ${email}`);
    }
};