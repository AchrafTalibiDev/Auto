import { isValidProxy } from '../utils/proxyUtils';

describe('isValidProxy', () => {
    it('accepte un proxy avec authentification', () => {
        const proxy = 'http://user:pass@123.123.123.123:8080';
        expect(isValidProxy(proxy)).toBe(true);
    });

    it('accepte un proxy sans authentification', () => {
        const proxy = 'http://123.123.123.123:8080';
        expect(isValidProxy(proxy)).toBe(true);
    });

    it('rejette un proxy invalide', () => {
        const proxy = 'invalidproxy';
        expect(isValidProxy(proxy)).toBe(false);
    });
});