/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                'text-main': 'var(--text-main)',
                'text-sub': 'var(--text-sub)',
                // Add other custom colors mapping if needed, but CSS variables handle most
            },
        },
    },
    plugins: [],
}
