import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}})()`,
					}}
				/>
				<Script
					defer
					src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
					data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
					strategy="afterInteractive"
				/>
			</Head>
			<body className="font-default container-xl mx-auto bg-bg-100 text-text-primary font-medium">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
