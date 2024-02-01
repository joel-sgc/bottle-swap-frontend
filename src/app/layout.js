import { Provider } from '@/components/ThemeProvider'
import { Roboto_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'

export const fontSans = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }) {  

  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Provider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Provider>
      </body>
    </html>
  )
}
