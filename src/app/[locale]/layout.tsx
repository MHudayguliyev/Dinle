import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
// for notification
import { Toaster } from 'react-hot-toast';
import {notFound} from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';

import '@styles/global.scss';
// import Swiper styles
import 'swiper/scss';
import 'swiper/css/navigation';
import 'swiper/css/grid';

//provider 
import {ReduxProvider} from '@redux/provider';
import OverflowSetterProvider from './_components/OverflowSetter';
const QueryProvider = dynamic(() => import('@app/_api/provider'))

export const metadata: Metadata = {
  title: 'Dinle-de hinlen',
  description: 'Dinle.com.tm',
  icons: {
    icon: '/logo.png'
  }
}
// Can be imported from a shared config
const locales = ['tk', 'ru'] 
export default function RootLayout({
  children, 
  params: {locale}
}: {
  children: React.ReactNode
  params: {locale: string}
}) {

  if (!locales.includes(locale)) notFound();
  const messages = useMessages();

  return (
    <html lang="tk">
      <ReduxProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <OverflowSetterProvider>
              <Toaster
                  position="top-center"
                  reverseOrder={false}
                />
                {children}
            </OverflowSetterProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </ReduxProvider>
    </html>
  )
}
