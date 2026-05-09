import { createSlice } from "@reduxjs/toolkit";

export interface RateLimitState {
	// Epoch ms when the throttle window ends, or null when not throttled.
	throttledUntil: number | null;
}

export const initialState: RateLimitState = {
	throttledUntil: null,
};

export const slice = createSlice({
	name: "rateLimit",
	initialState,
	reducers: {
		setThrottledUntil(state, action: { payload: number }) {
			state.throttledUntil = action.payload;
		},
		clearThrottle(state) {
			state.throttledUntil = null;
		},
	},
});

export const { setThrottledUntil, clearThrottle } = slice.actions;
export const reducer = slice.reducer;
