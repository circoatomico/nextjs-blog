import { AppProps } from 'next/app';
import '../styles/global.scss';

import { Header } from '../components/Header';

import Link from 'next/link'
import { PrismicProvider } from '@prismicio/react'

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <>
      <Header/>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
