"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export const Provider = ({ children, ...props }) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
)