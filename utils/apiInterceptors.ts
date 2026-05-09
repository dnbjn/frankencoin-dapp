import { from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { toast } from "react-toastify";
import { FRANKENCOIN_API_CLIENT, PONDER_CLIENT } from "../app.config";
import { store } from "../redux/redux.store";
import { setThrottledUntil } from "../redux/slices/rateLimit.slice";

const DEFAULT_COOLDOWN_MS = 30_000;
const MIN_TOAST_INTERVAL_MS = 30_000;
const MAX_429_RETRIES = 2;
const IDEMPOTENT_METHODS = new Set(["get", "head", "options"]);

let lastToastAt = 0;
let installed = false;

function parseRetryAfter(headerValue: string | null | undefined): number {
	if (!headerValue) return DEFAULT_COOLDOWN_MS;
	const seconds = Number(headerValue);
	if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
	const parsed = Date.parse(headerValue);
	if (!Number.isNaN(parsed)) return Math.max(0, parsed - Date.now());
	return DEFAULT_COOLDOWN_MS;
}

function readHeader(headers: any, key: string): string | null {
	if (!headers) return null;
	if (typeof headers.get === "function") return headers.get(key) ?? null;
	const lower = headers[key.toLowerCase()];
	if (typeof lower === "string") return lower;
	const original = headers[key];
	return typeof original === "string" ? original : null;
}

function notifyThrottled(retryAfterMs: number) {
	const now = Date.now();
	const newUntil = now + retryAfterMs;
	const currentUntil = store.getState().rateLimit.throttledUntil ?? 0;

	if (newUntil > currentUntil) {
		store.dispatch(setThrottledUntil(newUntil));
	}

	if (now - lastToastAt > MIN_TOAST_INTERVAL_MS) {
		const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
		toast.warn(
			`API rate limit reached. Pausing requests — automatic retries resume in ~${seconds}s.`,
			{ position: "bottom-right", autoClose: 6000 }
		);
		lastToastAt = now;
	}
}

function waitMs(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

// Wait until the global throttle window expires, plus small jitter so a wave
// of suspended requests doesn't all hit the API on the same millisecond.
async function waitForThrottleWindow(fallbackMs: number): Promise<void> {
	const until = store.getState().rateLimit.throttledUntil ?? Date.now() + fallbackMs;
	const jitter = Math.floor(Math.random() * 250);
	await waitMs(until - Date.now() + jitter);
}

export function setupApiInterceptors() {
	if (installed) return;
	installed = true;

	// Axios: on 429, update global throttle state and silently retry the
	// request once the window clears (idempotent methods only, capped retries).
	FRANKENCOIN_API_CLIENT.interceptors.response.use(
		(response) => response,
		async (error) => {
			const status = error?.response?.status;
			if (status !== 429) return Promise.reject(error);

			const config = error.config;
			const method = (config?.method ?? "get").toLowerCase();
			if (!config || !IDEMPOTENT_METHODS.has(method)) return Promise.reject(error);

			const retryAfter = parseRetryAfter(readHeader(error.response.headers, "retry-after"));
			notifyThrottled(retryAfter);

			const retryCount = ((config as any).__retry429Count ?? 0) + 1;
			(config as any).__retry429Count = retryCount;
			if (retryCount > MAX_429_RETRIES) return Promise.reject(error);

			await waitForThrottleWindow(retryAfter);
			return FRANKENCOIN_API_CLIENT.request(config);
		}
	);

	// Apollo: surface 429s into the same global state, and let RetryLink
	// transparently re-issue the operation after the window clears.
	const errorLink = onError(({ networkError }) => {
		const ne = networkError as any;
		const status = ne?.statusCode ?? ne?.response?.status;
		if (status === 429) {
			const retryAfter = parseRetryAfter(readHeader(ne?.response?.headers ?? ne?.headers, "retry-after"));
			notifyThrottled(retryAfter);
		}
	});

	const retryLink = new RetryLink({
		attempts: {
			max: MAX_429_RETRIES + 1, // includes the initial attempt
			retryIf: (error) => {
				const status = error?.statusCode ?? error?.response?.status;
				return status === 429;
			},
		},
		delay: () => {
			const until = store.getState().rateLimit.throttledUntil;
			if (!until) return 1000;
			const remaining = until - Date.now();
			return Math.max(remaining + Math.floor(Math.random() * 250), 250);
		},
	});

	PONDER_CLIENT.setLink(from([errorLink, retryLink, PONDER_CLIENT.link]));
}
