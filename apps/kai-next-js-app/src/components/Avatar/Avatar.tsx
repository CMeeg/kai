import { Image } from '~/components/Image'

interface AvatarProps {
  name: string
  picture: string
}

function Avatar({ name, picture }: AvatarProps) {
  return (
    <div className="flex items-center">
      <div className="w-12 h-12 relative mr-4">
        <Image src={picture} fill={true} className="rounded-full" alt={name} />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  )
}

export { Avatar }

export type { AvatarProps }
