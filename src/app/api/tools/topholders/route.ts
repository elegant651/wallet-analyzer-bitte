import { Pair } from '@/app/types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: `token not found` }, { status: 400 });
    }

    const apiSearchUrl = 'https://api.dexscreener.com/latest/dex/search?q='
    const tokenData = await fetch(apiSearchUrl + token)
    const tokenMatch = await tokenData.json()
    const pairs = tokenMatch.pairs.filter((pair: Pair) => pair.chainId === 'near')
    if (pairs.length === 0) {
      return NextResponse.json({ error: `Token ${token} not found` }, { status: 400 });
    }
    const pair = pairs[0]
    const contract = pair.baseToken.address

    const apiUrl = `https://api.nearblocks.io/v1/fts/${contract}/holders`
    const response2 = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEARBLOCKS_API_KEY}`
      }
    });
    if (!response2.ok) {
      return NextResponse.json({ error: `HTTP error! Status: ${response2.status}` }, { status: 400 });
    }

    const data = await response2.json();
    console.log("Response data:", data)

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error token', error);
    return NextResponse.json({ error: 'Failed to token' }, { status: 500 });
  }
}
