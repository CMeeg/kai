import type { Meta, StoryObj } from '@storybook/react'
import HomePage from './'

const meta = {
  title: 'Page/HomePage',
  component: HomePage,
  tags: ['autodocs']
} satisfies Meta<typeof HomePage>

export default meta

type Story = StoryObj<typeof HomePage>

export const Default: Story = {
  args: {
    preview: false
  }
}

export const Preview: Story = {
  args: {
    preview: true
  }
}
