import React from "react";
import { store } from "../redux/redux.store";
import { clearThrottle } from "../redux/slices/rateLimit.slice";

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
	throttledUntil: number | null;
	now: number;
}

export default class ErrorBoundary extends React.Component<Props, State> {
	private timer: ReturnType<typeof setInterval> | null = null;

	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null, throttledUntil: null, now: Date.now() };
	}

	static getDerivedStateFromError(error: Error): Partial<State> {
		// Snapshot throttle state at the moment the error happens so the
		// boundary can show a rate-limit message instead of the generic one.
		const throttledUntil = store.getState().rateLimit.throttledUntil;
		return { hasError: true, error, throttledUntil, now: Date.now() };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error("[ErrorBoundary]", error, info.componentStack);
	}

	componentDidUpdate(_: Props, prevState: State) {
		if (this.state.hasError && !prevState.hasError && this.state.throttledUntil) {
			this.timer = setInterval(() => this.setState({ now: Date.now() }), 1000);
		}
		if (!this.state.hasError && this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	componentWillUnmount() {
		if (this.timer) clearInterval(this.timer);
	}

	private handleReset = () => {
		// If we recovered past the throttle window, also clear the global flag
		// so the banner disappears alongside the boundary.
		const until = store.getState().rateLimit.throttledUntil;
		if (until !== null && Date.now() >= until) store.dispatch(clearThrottle());
		this.setState({ hasError: false, error: null, throttledUntil: null });
	};

	render() {
		if (!this.state.hasError) return this.props.children;

		const { throttledUntil, now } = this.state;
		const isThrottled = throttledUntil !== null && now < throttledUntil;
		const remaining = isThrottled ? Math.max(0, Math.ceil((throttledUntil! - now) / 1000)) : 0;

		const title = isThrottled ? "API rate limit reached" : "Something went wrong";
		const body = isThrottled ? (
			<>
				The data service is temporarily limiting requests from this browser.{" "}
				{remaining > 0 ? (
					<>
						Automatic retries will resume in <span className="font-semibold">{remaining}s</span>.
					</>
				) : (
					<>You can retry now.</>
				)}
			</>
		) : (
			<>
				We couldn&apos;t load this page. This is usually a temporary issue with our data service. Please try again in a moment, and
				if the problem persists, refresh the page or come back later.
			</>
		);
		const buttonLabel = isThrottled && remaining > 0 ? `Retry in ${remaining}s` : "Try again";

		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center bg-layout-primary">
				<div className="text-xl font-bold text-text-header">{title}</div>
				<div className="text-text-secondary text-sm max-w-md">{body}</div>
				<button
					className="btn px-4 py-2 bg-button-default text-white hover:bg-button-hover text-sm disabled:opacity-50"
					onClick={this.handleReset}
					disabled={isThrottled && remaining > 0}
				>
					{buttonLabel}
				</button>
			</div>
		);
	}
}
