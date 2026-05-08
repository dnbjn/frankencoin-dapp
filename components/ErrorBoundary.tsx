import React from "react";

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error("[ErrorBoundary]", error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center bg-layout-primary">
					<div className="text-xl font-bold text-text-header">Something went wrong</div>
					<div className="text-text-secondary text-sm max-w-md">
						We couldn&apos;t load this page. This is usually a temporary issue with our data service. Please try again in a
						moment, and if the problem persists, refresh the page or come back later.
					</div>
					<button
						className="btn px-4 py-2 bg-button-default text-white hover:bg-button-hover text-sm"
						onClick={() => this.setState({ hasError: false, error: null })}
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
