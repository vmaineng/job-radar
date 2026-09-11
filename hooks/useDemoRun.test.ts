import {renderHook, act, waitFor, render} from '@testing-library/react';
import { useDemoRun } from './useDemoRun';

describe("useDemoRun", () => { 
    beforeEach(() => { 
        global.fetch = jest.fn();
    });

    it('sets result on success', async() => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({status: "ok", saved_count : 3})
        });

        const {result} = renderHook(() => useDemoRun("/api/demo-run"));
        await act(async() => {
            await result.current.run({email: 'a@b.com', present:'x'})
        })
    });

    it('sets a generic error when the response is not ok', async () => { 
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async() => ({status: 'failed', saved_count: 0})
        })
        const {result} = renderHook(() => useDemoRun("/api/demo-run"))
        await act(async() => {
            await result.current.run({email: 'a@b.com', present:'x'})
        });
        expect (result.current.error).toMatch(/went wrong/i);
        expect(result.current.result).toBeNull();
        expect(result.current.loading).toBe(false);
    })
})