import fs from 'fs';

export const extractAndSaveSecretKey = async (page, email) => {
    try {
        await page.waitForSelector('ol.AOmWL li.mzEcT strong', { visible: true, timeout: 10000 });

        const secretKey = await page.evaluate(() => {
            const items = [...document.querySelectorAll('ol.AOmWL li.mzEcT')];
            for (const item of items) {
                if (item.textContent.includes('Saisissez votre adresse e-mail')) {
                    const strongTag = item.querySelector('strong:last-of-type');
                    return strongTag?.textContent?.replace(/\s+/g, '') || null;
                }
            }
            return null;
        });

        if (secretKey) {
            console.log("Clé extraite :", secretKey);
            fs.writeFileSync(`secret_key_${email}.txt`, secretKey);
            console.log(`Clé sauvegardée dans 'secret_key_${email}.txt'`);
            return true;
        } else {
            console.error("Clé secrète introuvable.");
            return false;
        }
    } catch (err) {
        console.error("Erreur lors de l'extraction de la clé secrète :", err.message);
        return false;
    }
};