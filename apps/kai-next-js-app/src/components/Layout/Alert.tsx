import cn from 'classnames'
import Container from '~/components/Container'
import styles from './Alert.module.css'

type AlertProps = { preview: boolean }

export default function Alert({ preview }: AlertProps) {
  return (
    <div
      className={cn({
        [styles['alert-preview']]: preview,
        [styles.alert]: !preview
      })}
    >
      <Container>
        <div className={styles['alert-inner']}>
          {preview ? (
            <>
              This page is a preview.{' '}
              <a href="/api/exit-preview" className={styles['link-preview']}>
                Click here
              </a>{' '}
              to exit preview mode.
            </>
          ) : (
            <>
              The source code for this blog is{' '}
              <a
                href="https://github.com/CMeeg/kai/tree/main/apps/kai-next-js-app"
                className={styles.link}
              >
                available on GitHub
              </a>
              .
            </>
          )}
        </div>
      </Container>
    </div>
  )
}
