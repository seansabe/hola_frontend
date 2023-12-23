import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default MyApp;