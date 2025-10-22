/** @type {import('tailwindcss').Config} */


module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/styles/constants.js',
        './node_modules/@adespota/my-react-component/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        container: {
            center: true,
            screens: {
                xs: "480px",
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                "2xl": "1536px",
                "3xl": "1920px",
                "4xl": "2560px",
                "5xl": "3840px"
            }
        },
        extend: {
            colors: {
                'myColor': {
                    default: '#626842', // Colore di base
                    light: 'rgba(129,140,248,0.68)',
                    colorText: '#3a4246' , // Colore di alcuni testi quando hanno bisogno del colore grigio che uso in tutti i testi
                    grayCard:'rgb(233,236,236)', // Colore Background Card
                    borderColorCard:'#dadce0',
                    colorTextNavBar:'#3a4246', // Colore del testo della NavBar
                    greyDefault: '#3a4246', // Colore grigio di default
                },
            },
            ringWidth: {
                '6': '6px',  // Imposta uno spessore dell'anello di 6 pixel, intorno alle caselle di input
            },
            boxShadow: {
                '3xl': '0px 20px 30px -10px rgb(38, 57, 77)',
                '4xl': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
            },
            borderRadius: {
                '4xl': '35px',
            },
            borderWidth: {
                '3': '3px',
                '4': '4px',
            },
            keyframes: {
                bounceIn: {
                    '0%, 20%, 40%, 60%, 80%, 100%': {
                        animationTimingFunction: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                    },
                    '0%': {
                        opacity: 0,
                        transform: 'scale3d(.3, .3, .3)',
                    },
                    '20%': {
                        transform: 'scale3d(1.1, 1.1, 1.1)',
                    },
                    '40%': {
                        transform: 'scale3d(.9, .9, .9)',
                    },
                    '60%': {
                        opacity: 1,
                        transform: 'scale3d(1.03, 1.03, 1.03)',
                    },
                    '80%': {
                        transform: 'scale3d(.97, .97, .97)',
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'scale3d(1, 1, 1)',
                    },
                },
            },
            animation: {
                bounceIn: 'bounceIn 2s linear',
            },
        },
    }
}

