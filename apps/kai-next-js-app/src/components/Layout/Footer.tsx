import Container from '~/components/Container'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles['footer-inner']}>
          <h3 className={styles['footer-heading']}>
            Statically Generated with Next.js.
          </h3>
          <div className={styles['footer-links']}>
            <a
              href="https://nextjs.org/docs/basic-features/pages"
              className={styles.button}
            >
              Read Documentation
            </a>
            <a
              href="https://github.com/CMeeg/kai/tree/main/apps/kai-next-js-app"
              className={styles.link}
            >
              View on GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
