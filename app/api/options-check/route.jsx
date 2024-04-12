import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import usePersistentStore from '../../../store/usePersistentStore';

async function getResponse(req) {
  const body = await req.json();
  console.log(req.nextUrl.searchParams.get("direction"));
  const { isValid, message } = 
  process.env.NODE_ENV === 'development' 
      ? { isValid: true, message: {} }
      : await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  // TODO :: Roll for luck 50%.

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const text = message.input || '';
  let state = {
    page: 0,
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized ?? '{}'));
  } catch (e) {
    console.error(e);
  }

  //usePersistentStore.getState().setStatus(1);
  // TODO :: Unlucky page, just spin again.
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: process.env.NODE_ENV === 'development' ? 
      [
        
        {
          action: 'post',
          label: '🐂 Bullish',
          target: `${NEXT_PUBLIC_URL}/api/tx-success?direction=1`,
        },
        {
          action: 'post',
          label: '🐻 Bearish',
          target: `${NEXT_PUBLIC_URL}/api/tx-success?direction=-1`,
        }
      ]
      : [
        
        {
          action: 'tx',
          label: '🐂 Bullish',
          target: `${NEXT_PUBLIC_URL}/api/tx?direction=1`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success?direction=1`,
        },
        {
          action: 'tx',
          label: '🐻 Bearish',
          target: `${NEXT_PUBLIC_URL}/api/tx?direction=-1`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success?direction=-1`,
        }
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/predict.jpg`,
      }
    }),
  );
}

export async function POST(req) {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
