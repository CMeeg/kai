import type { Meta, StoryObj } from '@storybook/react'
import Image from './'
import coverPic from '../../../public/cover.jpg'

const meta = {
  title: 'Components/Image',
  component: Image,
  tags: ['autodocs']
} satisfies Meta<typeof Image>

export default meta

type Story = StoryObj<typeof Image>

export const KontentImage: Story = {
  args: {
    src: 'https://assets-eu-01.kc-usercontent.com/b78a9cd1-c9b0-0115-36d0-f7fc5a0d4e94/21386df4-cdec-4e9a-8135-e99c9971df40/cover.jpg',
    alt: 'Post',
    width: 2000,
    height: 1000
  }
}

export const LocalImage: Story = {
  args: {
    src: coverPic,
    alt: 'Local'
  }
}
