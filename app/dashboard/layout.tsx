import type React from "react"
import type { Metadata } from "next"
import { metadata as dashboardMetadata } from "./metadata"

export const metadata: Metadata = dashboardMetadata

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
