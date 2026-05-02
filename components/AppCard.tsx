interface Props {
	children?: React.ReactNode;
	className?: string;
}

export default function AppCard({ className, children }: Props) {
	return (
		<section className={`bg-card-body-primary border border-card-body-seperator shadow-sm rounded-xl ${className ?? "p-5 md:p-6 flex flex-col gap-y-4"}`}>
			{children}
		</section>
	);
}
