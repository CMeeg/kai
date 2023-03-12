import type { Meta, StoryObj } from '@storybook/react'
import Container from './'
import Image from '../Image'
import coverPic from '../../../public/cover.jpg'

const meta = {
  title: 'Kai/Container',
  component: Container,
  tags: ['autodocs']
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof Container>

export const TextChildren: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet adipiscing elit non secteteur.'
  }
}

export const ImageChildren: Story = {
  args: {
    children: <Image src={coverPic} alt="Image" />
  }
}
