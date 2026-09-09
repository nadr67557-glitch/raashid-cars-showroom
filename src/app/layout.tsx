import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'معرض راشد كارز للسيارات — الرياض | Raashid Cars',
  description: 'معرض راشد كارز للسيارات في الرياض — تشكيلة واسعة من السيارات الفاخرة والاقتصادية بأسعار تنافسية وخدمات تمويلية مميزة',
  keywords: ['معرض سيارات', 'رياض', 'سيارات', 'تويوتا', 'نيسان', 'لكزس', 'كاديلاك'],
  authors: [{ name: 'Raashid Cars' }],
  openGraph: {
    title: 'معرض راشد كارز للسيارات — الرياض',
    description: 'تشكيلة واسعة من السيارات الفاخرة والاقتصادية',
    type: 'website',
    locale: 'ar_SA',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  )
}
