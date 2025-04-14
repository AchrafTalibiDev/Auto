import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const CAPTCHA_API_KEY = process.env.CAPTCHA_API_KEY;

//solve Captcha

const solveCaptcha = async (page) => {
    try {
        const captchaImage = await page.$('img'); // Sélectionne l'image CAPTCHA
        const captchaBase64 = await captchaImage.screenshot(); // Récupère l'image en base64

        // Envoie l'image à 2Captcha pour résoudre le CAPTCHA
        const formData = new FormData();
        formData.append('key', CAPTCHA_API_KEY);
        formData.append('body', captchaBase64.toString('base64')); // Envoie le CAPTCHA
        formData.append('method', 'base64');
        formData.append('json', 1);

        const response = await axios.post('http://2captcha.com/in.php', formData, {
            headers: formData.getHeaders(),
        });

        const requestId = response.data.request;
        const captchaSolution = await waitForCaptchaSolution(requestId); // Attendre la solution du CAPTCHA

        return captchaSolution;
    } catch (error) {
        console.error('Erreur lors de la résolution du CAPTCHA:', error.message);
        return null;
    }
};


// Attends que 2Captcha fournisse la solution du CAPTCHA

/**
 * Attend la résolution d'un captcha via polling sur 2captcha.
 * @param {string} requestId - ID de la requête captcha.
 * @param {number} pollInterval - Intervalle entre chaque vérification (par défaut 5000 ms).
 * @returns {Promise<string|null>} La solution du captcha ou null en cas d’erreur.
 */
export const waitForCaptchaSolution = async (requestId, pollInterval = 5000) => {
    try {
        while (true) {
            const response = await axios.get(`http://2captcha.com/res.php?key=${CAPTCHA_API_KEY}&action=get&id=${requestId}&json=1`);
            if (response.data.status === 1) {
                return response.data.request;
            }
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
    } catch (error) {
        console.error('Erreur lors de l\'attente de la solution CAPTCHA:', error.message);
        return null;
    }
};

//Recaptcha V2 en cas d'un bouton à cocher je ne suis pas un robot

const solveRecaptchaV2 = async (page) => {
    try {
        const pageUrl = page.url();
        const siteKey = await page.$eval('div[g-recaptcha], div[data-sitekey]', el => el.getAttribute('data-sitekey'));

        const response = await axios.get(`http://2captcha.com/in.php?key=${CAPTCHA_API_KEY}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${pageUrl}&json=1`);
        const requestId = response.data.request;

        console.log("CAPTCHA soumis à 2Captcha...");

        let token = null;
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 5000));
            const res = await axios.get(`http://2captcha.com/res.php?key=${CAPTCHA_API_KEY}&action=get&id=${requestId}&json=1`);
            if (res.data.status === 1) {
                token = res.data.request;
                break;
            }
        }

        if (!token) throw new Error("CAPTCHA non résolu à temps.");

        // Injecter le token dans le champ prévu
        await page.evaluate((token) => {
            const responseField = document.getElementById('g-recaptcha-response');
            if (responseField) {
                responseField.innerHTML = token;
            } else {
                const textarea = document.createElement('textarea');
                textarea.id = 'g-recaptcha-response';
                textarea.name = 'g-recaptcha-response';
                textarea.style.display = 'none';
                textarea.innerHTML = token;
                document.body.appendChild(textarea);
            }
            // Soumettre le formulaire si nécessaire
            const form = document.querySelector('form');
            if (form) form.submit();
        }, token);

        return true;
    } catch (err) {
        console.error("Erreur solveRecaptchaV2:", err.message);
        return false;
    }
};
