import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MapSkeleton from './map-skeleton';
import MapErrorModal from './map-error-modal';

const meta: Meta = {
  title: 'Map/ErrorScreen',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: '지도 오류 화면',
  render: () => (
    <div className="relative h-screen w-screen overflow-hidden bg-[#f2f3f5]">
      <MapSkeleton />
      <MapErrorModal onConfirm={() => alert('앱 종료 (Storybook 미리보기)')} />
    </div>
  ),
};
