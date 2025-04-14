import { processAccount } from './accountProcessor.js';
import {execSync} from 'child_process';

// Fonction pour obtenir la largeur de l'écran (Windows)
const getScreenWidth = () => {
    try {
        const output = execSync('wmic path Win32_VideoController get CurrentHorizontalResolution').toString();
        const matches = output.match(/\d+/g);
        return matches ? parseInt(matches[matches.length - 1], 10) : 1920;
    } catch (err) {
        console.warn("Impossible de détecter la largeur de l'écran. Valeur par défaut : 1920px");
        return 1920;
    }
};

export const automateGmailKeyExtraction = async (accounts) => {

    const screenWidth = getScreenWidth();
    const windowWidth = Math.floor(screenWidth / accounts.length);

    const positionedAccounts = accounts.map((acc, index) => ({
        ...acc,
        windowX: index * windowWidth,
        windowWidth
    }));

    await Promise.all(positionedAccounts.map(acc => processAccount(acc)));
};

