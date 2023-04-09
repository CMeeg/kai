import { parseISO, format } from 'date-fns'

interface PostDateProps {
  dateString: string | null
}

function PostDate({ dateString }: PostDateProps) {
  if (dateString === null) {
    return null
  }

  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'LLLL	d, yyyy')}</time>
}

export { PostDate }

export type { PostDateProps }
