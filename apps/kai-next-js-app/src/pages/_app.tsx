import type { AppProps } from 'next/app'
import type { MetaProps } from '~/components/Meta'
import { Layout } from '~/components/Layout'
import type { LayoutContentProps } from '~/components/Layout'
import '~/styles/globals.css'

interface RouteProps<TPageContentProps> {
  meta: MetaProps
  layout: LayoutContentProps
  page: TPageContentProps
}

type AppPageRouteProps = AppProps<RouteProps<unknown>>

export default function MyApp({ Component, pageProps }: AppPageRouteProps) {
  return (
    <Layout preview={pageProps.layout.preview}>
      <Component {...pageProps} />
    </Layout>
  )
}

export type { RouteProps }
