import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/redux.store";
import { clearThrottle } from "../redux/slices/rateLimit.slice";

export default function RateLimitBanner() {
	const throttledUntil = useSelector((s: RootState) => s.rateLimit.throttledUntil);
	const dispatch = useDispatch();
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		if (!throttledUntil) return;
		const tick = () => {
			const t = Date.now();
			setNow(t);
			if (t >= throttledUntil) dispatch(clearThrottle());
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [throttledUntil, dispatch]);

	if (!throttledUntil || now >= throttledUntil) return null;

	const remaining = Math.max(0, Math.ceil((throttledUntil - now) / 1000));

	return (
		<div className="w-full px-3 md:px-6 pt-3">
			<div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
				<div className="bg-status-warning-muted border border-status-warning rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
					<span className="inline-block w-2 h-2 rounded-full bg-status-warning animate-pulse flex-shrink-0" />
					<div className="text-sm">
						<span className="font-semibold text-text-warning">API rate limit reached.</span>{" "}
						<span className="text-text-secondary">Pausing requests — automatic retries resume in {remaining}s.</span>
					</div>
				</div>
			</div>
		</div>
	);
}
