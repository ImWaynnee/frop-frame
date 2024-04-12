import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { encodeFunctionData, parseEther } from 'viem';
import { base } from 'viem/chains';
import BuyMeACoffeeABI from '../../_contracts/BuyMeACoffeeABI';
import { BUY_MY_COFFEE_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
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

  // TODO :: Unlucky page

  // Just try making transaction, to move into the tx route.
  const data = encodeFunctionData({
    abi: BuyMeACoffeeABI,
    functionName: 'buyCoffee',
    args: [parseEther('1'), 'Coffee all day!'],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${base.id}`, // Remember Base Sepolia might not work on Warpcast yet
    method: 'eth_sendTransaction',
    params: {
      abi: [],
      data,
      to: BUY_MY_COFFEE_CONTRACT_ADDR,
      value: parseEther('0.00004').toString(), // 0.00004 ETH
    },
  };

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: '🐻 Bearish',
          target: `${NEXT_PUBLIC_URL}/api/tx`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
        },
        {
          label: '🐂 Bullish',
          target: `${NEXT_PUBLIC_URL}/api/tx`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-1.png`,
      },
      state: {
        page: state?.page + 1,
        time: new Date().toISOString(),
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
