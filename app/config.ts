// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://frop-frame.vercel.app';
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0xdB689Dd8B4B5f9767492b0Bee718D97F875718d0';
