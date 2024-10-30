import { Pair } from '@/app/types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const apiUri = 'https://api.dexscreener.com/latest/dex/search?q='
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 400 });
    }
    const tokenData = await fetch(apiUri + token)
    const tokenMatch = await tokenData.json()
    const pairs = tokenMatch.pairs.filter((pair: Pair) => pair.chainId === 'near')

    if (pairs.length === 0) {
      return NextResponse.json({ error: `Token ${token} not found` }, { status: 400 });
    }

    return NextResponse.json({ pair: pairs[0] });
  } catch (error) {
    console.error('Error token', error);
    return NextResponse.json({ error: 'Failed to token' }, { status: 500 });
  }
}
