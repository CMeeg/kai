import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
}

function Container({ children }: ContainerProps) {
  return <div className="container mx-auto px-5">{children}</div>
}

export { Container }

export type { ContainerProps }
