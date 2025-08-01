/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        container: {
            center: 'true',
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                rotate: 'rotate 10s linear infinite'
            },
            backgroundImage: {
                'hero-pattern': 'url(/assets/web-2.png)',
                'custom-gradient': 'linear-gradient(60deg, transparent, #ff2020, #f70000)'
            },
            colors: {
                primary: '#00bed7',
                'primary-dark': '#1098ad',
                'primary-light': '#e3fafc',
                'text-color': '#495c67',
                dark50: '#2b2c37',
                dark100: '#20212C'
            }
        }
    },
    plugins: [require('tailwindcss-animate')],
};
