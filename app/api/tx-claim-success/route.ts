import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import {getDayStart, convertDateForDisplay} from '../../../library/datetime';
import usePersistentStore from '../../../store/usePersistentStore';
import { isBefore } from 'date-fns';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const direction = req.nextUrl.searchParams.get("direction");

  usePersistentStore.getState().setTimePurchased(new Date());
  console.log(usePersistentStore.getState().timePurchased);
  const { isValid } = 
  process.env.NODE_ENV === 'development' 
      ? { isValid: true }
      : await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const todayDraw = getDayStart();
  const canSettle = isBefore(usePersistentStore.getState().timePurchased, todayDraw);
console.log(canSettle);
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Well done! Try again tomorrow`
        }
      ]
      ,
      image: {
        src: `${NEXT_PUBLIC_URL}/park-4.png`,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
