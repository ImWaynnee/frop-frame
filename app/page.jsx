import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL } from './config';
import usePersistentStore from '../store/usePersistentStore';
import { userFlowEnum } from '../constants/enum';

// Default pre-load metadata
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: '🍀 Spin the Wheel!',
    }
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/wheel.jpg`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/options-check`,
});

export const metadata = {
  title: 'FROP',
  description: 'Feeling lucky? Try for free options!',
  openGraph: {
    title: 'FROP',
    description: 'Feeling lucky? Try for free options!',
    images: [`${NEXT_PUBLIC_URL}/wheel.jpg`],
  },
  other: {
    ...frameMetadata,
  },
};

const getButtons = () => {
  const status = usePersistentStore.getState().status;
  console.log('Status: ', status);

  switch (status) {
    case userFlowEnum.LUCKY:
    /*  return [{
        action: 'tx',
        label: '🐻 Bearish',
        target: `${NEXT_PUBLIC_URL}/api/tx`,
        postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
      },
      {
        action: 'tx',
        label: '🐂 Bullish',
        target: `${NEXT_PUBLIC_URL}/api/tx`,
        postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
      }];*/
    case userFlowEnum.INITIAL:
    default:
      return [{
        label: '🍀 Spin the Wheel!',
      }];
  }
}

export default function Page() {
  console.log(metadata.other);

  // Enable to reset
  usePersistentStore.getState().setStatus(userFlowEnum.INITIAL);

  metadata.other = getFrameMetadata({
    buttons: [
      ...getButtons()
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/wheel.jpg`,
      aspectRatio: '1:1',
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/options-check?direction=test`,
  });

  return (
    <>
      <h1>FROP - Free $DEGEN Options</h1>
    </>
  );
}
