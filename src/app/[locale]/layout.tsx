import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
// for notification
import { Toaster } from 'react-hot-toast';


import '@styles/global.scss';
// import Swiper styles
import 'swiper/scss';
import 'swiper/css/navigation';
import 'swiper/css/grid';

//provider 
import {ReduxProvider} from '@redux/provider';
import OverflowSetterProvider from './_components/OverflowSetter';
import ProfileMiddleware from './_components/ProfileMiddleware';
const QueryProvider = dynamic(() => import('@app/_api/provider'))

export const metadata: Metadata = {
  title: 'Dinle-de hinlen',
  description: 'Dinle.com.tm'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <ReduxProvider>
        <QueryProvider>
          <ProfileMiddleware>
            <OverflowSetterProvider>
              <Toaster
                  position="top-center"
                  reverseOrder={false}
                />
                {children}
            </OverflowSetterProvider>
          </ProfileMiddleware>
        </QueryProvider>
      </ReduxProvider>
    </html>
  )
}
