/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite-react/lib/**/*.js"],
	safelist: [
		{
			pattern: /grid-cols-/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
	],
	theme: {
		fontFamily: {
			default: ["Inter", "sans-serif"],
		},
		extend: {
			height: {
				main: "calc(100vh)",
			},
			minHeight: {
				content: "calc(100vh - 230px)",
			},
			transitionProperty: {
				height: "height",
			},
			colors: {
				"bg-100": "hsl(var(--bg-100) / <alpha-value>)",
				"bg-200": "hsl(var(--bg-200) / <alpha-value>)",
				"bg-300": "hsl(var(--bg-300) / <alpha-value>)",
				"bg-nav": "hsl(var(--bg-nav) / <alpha-value>)",
				"bg-footer": "hsl(var(--bg-footer) / <alpha-value>)",
				layout: {
					primary: "var(--color-layout-primary)",
					secondary: "var(--color-layout-secondary)",
					footer: "var(--color-layout-footer)",
				},
				menu: {
					text: "var(--color-menu-text)",
					textactive: "var(--color-menu-textactive)",
					active: "var(--color-menu-active)",
					hover: "var(--color-menu-hover)",
					back: "var(--color-menu-back)",
					separator: "var(--color-menu-separator)",
				},
				card: {
					input: {
						label: "var(--color-card-input-label)",
						disabled: "var(--color-card-input-disabled)",
						empty: "var(--color-card-input-empty)",
						focus: "var(--color-card-input-focus)",
						error: "var(--color-card-input-error)",
						border: "var(--color-card-input-border)",
						hover: "var(--color-card-input-hover)",
						min: "var(--color-card-input-min)",
						max: "var(--color-card-input-max)",
						reset: "var(--color-card-input-reset)",
					},
					body: {
						primary: "var(--color-card-body-primary)",
						secondary: "var(--color-card-body-secondary)",
						seperator: "var(--color-card-body-seperator)",
					},
					content: {
						primary: "var(--color-card-content-primary)",
						secondary: "var(--color-card-content-secondary)",
						highlight: "var(--color-card-content-highlight)",
					},
				},
				text: {
					header: "var(--color-text-header)",
					subheader: "var(--color-text-subheader)",
					active: "var(--color-text-active)",
					primary: "var(--color-text-primary)",
					secondary: "var(--color-text-secondary)",
					warning: "var(--color-text-warning)",
					success: "var(--color-text-success)",
				},
				table: {
					header: {
						primary: "var(--color-table-header-primary)",
						secondary: "var(--color-table-header-secondary)",
					},
					row: {
						primary: "var(--color-table-row-primary)",
						secondary: "var(--color-table-row-secondary)",
						hover: "var(--color-table-row-hover)",
					},
				},
				button: {
					default: "var(--color-button-default)",
					hover: "var(--color-button-hover)",
					disabled: "var(--color-button-disabled)",
					textdisabled: "var(--color-button-textdisabled)",
				},
				link: "var(--color-link)",
				status: {
					danger: "var(--color-status-danger)",
					"danger-muted": "var(--color-status-danger-muted)",
					warning: "var(--color-status-warning)",
					"warning-muted": "var(--color-status-warning-muted)",
					success: "var(--color-status-success)",
					"success-muted": "var(--color-status-success-muted)",
					info: "var(--color-status-info)",
					"info-muted": "var(--color-status-info-muted)",
					orange: "var(--color-status-orange)",
					purple: "var(--color-status-purple)",
					"purple-muted": "var(--color-status-purple-muted)",
				},
			},
		},
	},
	darkMode: "class",
	plugins: [require("flowbite/plugin")({ charts: true })],
};
