import type { Meta, StoryObj } from '@storybook/react'
import Layout from './'

const meta = {
  title: 'Components/Layout',
  component: Layout,
  tags: ['autodocs']
} satisfies Meta<typeof Layout>

export default meta

type Story = StoryObj<typeof Layout>

export const Default: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet adipiscing elit non secteteur.'
  }
}

export const Preview: Story = {
  args: {
    children: 'Lorem ipsum dolor sit amet adipiscing elit non secteteur.',
    preview: true
  }
}
