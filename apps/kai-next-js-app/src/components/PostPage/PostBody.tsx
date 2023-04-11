import styles from './PostBody.module.css'

interface PostBodyProps {
  content: string
}

function PostBody({ content }: PostBodyProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={styles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export { PostBody }

export type { PostBodyProps }
