import { authenticator } from 'otplib';

export const handleTwoFactorAuth = async (page, acc) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 4000));
        await page.waitForSelector('input[type="tel"]', { visible: true, timeout: 20000 });

        if (!acc.secret2fa || typeof acc.secret2fa !== 'string') {
            console.error(`Secret 2FA invalide pour ${acc.email}`);
            return false;
        }

        const otpCode = authenticator.generate(acc.secret2fa);
        console.log(`Code 2FA pour ${acc.email} : ${otpCode}`);

        await page.type('input[type="tel"]', otpCode, { delay: 100 });

        await Promise.all([
            page.keyboard.press('Enter'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        return true;
    } catch (e) {
        console.log("Aucune vérification 2FA détectée ou erreur pendant l'OTP.");
        return false;
    }
};