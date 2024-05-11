/// NOTE: THIS PAGE IS CREATED JUST FOR THE SEO OF HOME PAGE AS ITS LAYOUT USES CLIENT SIDE RENDERING
import type { Metadata } from 'next'
import Script from 'next/script';
import PageClient from "./page.client"; 
import { setMetaValues } from '@utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  return setMetaValues({
    title: 'Diňle-de hiňlen', 
    description: 'dinle.com.tm description', 
    openGraph: {
      type: 'website', 
      url: 'https://aydym.com', 
      title: 'Diňle-de hiňlen', 
    }
  })
}

export default function Home() {
  return (
    <>
      <PageClient />
    </>
  )
}
