
export const navigateToAuthenticator = async (page) => {
    try {
        console.log("Navigation vers la page de sécurité de Google...");

        // Aller à la page de gestion de la sécurité Google
        await page.goto('https://myaccount.google.com/security', { waitUntil: 'networkidle2' });

        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);  // Scroll vers le bas
        });

        // Attente de la section spécifique "Comment vous vous connectez à Google"
        await page.waitForSelector('div.Z0Wvsf', { visible: true });
        console.log("Section 'Comment vous vous connectez à Google' trouvée");

        // Cliquer sur "Validation en deux étapes"
        const clicked = await page.evaluate(() => {
            const links = [...document.querySelectorAll('a.RlFDUe.I6g62c.N5YmOc.kJXJmd')];
            for (const link of links) {
                const labelDiv = link.querySelector('.bJCr1d');
                if ((labelDiv && labelDiv.textContent.includes('2-Step Verification')) || ( labelDiv && labelDiv.textContent.includes('Validation en deux' ))) {
                    link.click();
                    return true;
                }
            }
            return false;
        });

        if (clicked) {
            console.log("Clic sur 'Validation en deux étapes' réussi.");
            await new Promise(resolve => setTimeout(resolve, 4000)); // Attente pour le changement de page
            try {
                await page.evaluate(() => {
                    window.scrollBy(0, window.innerHeight);  // Scroll vers le bas
                });
                await page.waitForSelector('div.GqRghe.tXqPBe.hv7wl .mMsbvc', { visible: true, timeout: 10000 });

                const clickedAuthenticator = await page.evaluate(() => {
                    const options = [...document.querySelectorAll('div.GqRghe.tXqPBe.hv7wl .mMsbvc')];
                    const authOption = options.find(el => el.textContent.includes('Authenticator'));
                    if (authOption) {
                        authOption.click();
                        return true;
                    }
                    return false;
                });

                if (clickedAuthenticator) {
                    console.log("Clic sur 'Authenticator' réussi.");
                    await new Promise(resolve => setTimeout(resolve, 4000));

                } else {
                    console.error("Option 'Authenticator' non trouvée.");
                }
            } catch (err) {
                console.error("Erreur lors du clic sur 'Authenticator':", err.message);
            }
            // Étape : Cliquer sur le bouton "Configurer une appli d'authentification"
            try {
                await page.waitForSelector('span.AeBiU-vQzf8d', { visible: true, timeout: 10000 });

                const clicked = await page.evaluate(() => {
                    const spans = [...document.querySelectorAll('span.AeBiU-vQzf8d')];
                    for (const span of spans) {
                        if (span.textContent.includes("Configurer une appli d'authentification")) {
                            span.click();
                            return true;
                        }
                    }
                    return false;
                });

                if (clicked) {
                    console.log("Clic sur 'Configurer une appli d'authentification' réussi.");
                    await new Promise(resolve => setTimeout(resolve, 4000));
                } else {
                    console.error("Bouton 'Configurer une appli d'authentification' introuvable.");
                }
            } catch (err) {
                console.error("Erreur lors du clic sur 'Configurer une appli d'authentification':", err.message);
            }
            // Étape : Cliquer sur "Vous ne pouvez pas le scanner ?"
            try {
                await page.waitForSelector('span.mUIrbf-vQzf8d', { visible: true, timeout: 10000 });

                const clicked = await page.evaluate(() => {
                    const spans = [...document.querySelectorAll('span.mUIrbf-vQzf8d')];
                    for (const span of spans) {
                        if (span.textContent.includes("Vous ne pouvez pas le scanner")) {
                            span.click();
                            return true;
                        }
                    }
                    return false;
                });

                if (clicked) {
                    console.log("Clic sur 'Vous ne pouvez pas le scanner ?' réussi.");
                    await new Promise(resolve => setTimeout(resolve, 4000));
                } else {
                    console.error("Lien 'Vous ne pouvez pas le scanner ?' introuvable.");
                }
            } catch (err) {
                console.error("Erreur lors du clic sur 'Vous ne pouvez pas le scanner ?':", err.message);
            }

        } else {
            console.error("Option 'Validation en deux étapes' introuvable.");
        }
    } catch (err) {
        console.error("Erreur lors de la navigation vers l'authentification 2FA:", err.message);
    }
};