interface Props {
	title?: string;
	height?: number;
	loading?: boolean;
	children: React.ReactNode;
}

export default function ChartWrapper({ title, height = 340, loading = false, children }: Props) {
	if (loading) {
		return <div className="rounded-lg bg-card-content-primary animate-pulse" style={{ height }} />;
	}

	return (
		<div>
			{title && <div className="text-sm font-semibold text-text-secondary mb-3">{title}</div>}
			{children}
		</div>
	);
}
