import { getRandomUserAgent } from '../utils/userAgentUtils.js';

describe('getRandomUserAgent', () => {
    it('retourne une chaîne de caractères valide', () => {
        const userAgent = getRandomUserAgent();
        expect(typeof userAgent).toBe('string');
        expect(userAgent.length).toBeGreaterThan(0);
    });
});