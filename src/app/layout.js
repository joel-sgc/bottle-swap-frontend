import { Provider } from '@/components/ThemeProvider'
import { Roboto_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'

export const fontSans = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
})

export function generateMetadata() {
  return {
    title: "Bottle Swapper Demo",
    description: "A demo of a bottle swapper app",
  }
}

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
