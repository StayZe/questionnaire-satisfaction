import React from 'react'
import localFont from 'next/font/local'
import './styles.css'

const moreSugar = localFont({
  src: '../../../public/fonts/MoreSugar-Regular.ttf',
  variable: '--font-more-sugar',
  display: 'swap',
})

export const metadata = {
  description: "Questionnaire de satisfaction pour L'échequier",
  title: "Questionnaire - L'échequier",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="fr" className={moreSugar.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main>{children}</main>
      </body>
    </html>
  )
}
