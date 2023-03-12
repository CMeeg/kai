import type { ReactNode } from 'react'
import styles from './Container.module.css'

interface ContainerProps {
  children: ReactNode
}

function Container({ children }: ContainerProps) {
  return <div className={styles.container}>{children}</div>
}

export { Container }

export type { ContainerProps }
