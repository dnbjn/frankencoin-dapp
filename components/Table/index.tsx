interface Props {
	children: React.ReactElement[];
}

export default function Table({ children }: Props) {
	return (
		<section>
			<div className="rounded-lg border border-card-body-seperator">{children}</div>
		</section>
	);
}
