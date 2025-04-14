import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import {deleteSession} from '../utils/sessionUtils.js';
import {handleTwoFactorAuth} from './twoFactorHandler.js';
import {extractAndSaveSecretKey} from './keyExtractor.js';
import {navigateToAuthenticator} from "./navigateToAuthenticator.js";

dotenv.config();

export const processAccount = async (acc) => {
    deleteSession(acc.email);

    const launchArgs = ['--start-maximized',
                                '--disable-infobars',
                                '--disable-blink-features=AutomationControlled',
                                `--window-size=${acc.windowWidth || 960 },1080`,
                                `--window-position=${acc.windowX || 0 },0`
    ];

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: process.env.BRAVE_PATH,
        args: launchArgs,
        defaultViewport: null
    });

    const page = await browser.newPage();

    try {
        await page.goto('https://accounts.google.com/signin/v2/identifier', {waitUntil: 'networkidle0'});

        const isLoggedIn = await page.evaluate(() => {
            return !document.querySelector('input[type="email"]');
        });

        if (!isLoggedIn) {
            console.log(`Connexion requise pour : ${acc.email}`);
            await page.goto('https://accounts.google.com/signin/v2/identifier', {waitUntil: 'networkidle2'});
            await page.waitForSelector('input[type="email"]', {visible: true});
            await page.type('input[type="email"]', acc.email, {delay: 100});
            await Promise.all([
                page.click('#identifierNext'),
                page.waitForNavigation({waitUntil: 'networkidle2'})
            ]);

            await page.waitForSelector('input[type="password"]', {visible: true, timeout: 10000});
            await page.type('input[type="password"]', acc.password, {delay: 100});
            await Promise.all([
                page.click('#passwordNext'),
                page.waitForNavigation({waitUntil: 'networkidle2'})
            ]);
        } else {
            console.log(`Déjà connecté à : ${acc.email}`);
        }

        await handleTwoFactorAuth(page, acc);
        await navigateToAuthenticator(page);
        await extractAndSaveSecretKey(page, acc.email);

    } catch (err) {
        console.error(`Erreur pour ${acc.email} :`, err.message);
    } finally {
        await browser.close();
    }
};