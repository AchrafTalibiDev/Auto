import axios from 'axios';
import { waitForCaptchaSolution } from '../utils/captchaSolver';

jest.mock('axios');

describe('waitForCaptchaSolution', () => {
    it('retourne la solution du captcha après polling', async () => {
        axios.get
            .mockResolvedValueOnce({ data: { status: 0 } }) // en cours
            .mockResolvedValueOnce({ data: { status: 1, request: 'solved_captcha' } }); // résolu

        const solution = await waitForCaptchaSolution('dummy_id', 0); // on passe un interval de 0 pour aller vite
        expect(solution).toBe('solved_captcha');
    });
});