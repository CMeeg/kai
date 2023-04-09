import type { Meta, StoryObj } from '@storybook/react'
import KontentImage from './'

const meta = {
  title: 'Components/KontentImage',
  component: KontentImage,
  tags: ['autodocs']
} satisfies Meta<typeof KontentImage>

export default meta

type Story = StoryObj<typeof KontentImage>

export const Author: Story = {
  args: {
    src: 'https://assets-eu-01.kc-usercontent.com/b78a9cd1-c9b0-0115-36d0-f7fc5a0d4e94/6e4beec4-2ada-4c9b-b895-8ffd02a6cfe2/jj.jpeg',
    alt: 'Author',
    width: 100,
    height: 100
  }
}

export const Post: Story = {
  args: {
    src: 'https://assets-eu-01.kc-usercontent.com/b78a9cd1-c9b0-0115-36d0-f7fc5a0d4e94/21386df4-cdec-4e9a-8135-e99c9971df40/cover.jpg',
    alt: 'Post',
    width: 2000,
    height: 1000
  }
}

export const PostTransformed: Story = {
  args: {
    src: 'https://assets-eu-01.kc-usercontent.com/b78a9cd1-c9b0-0115-36d0-f7fc5a0d4e94/21386df4-cdec-4e9a-8135-e99c9971df40/cover.jpg',
    alt: 'Post',
    width: 2000,
    height: 1000,
    transform: (builder) => builder.withFocalPointCrop(0.5, 0.5, 5)
  }
}
