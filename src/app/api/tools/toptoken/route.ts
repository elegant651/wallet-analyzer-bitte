import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const apiUrl = `https://api.nearblocks.io/v1/fts`
    const { searchParams } = new URL(request.url);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEARBLOCKS_API_KEY}`
      }
    });
    if (!response.ok) {
      return NextResponse.json({ error: `HTTP error! Status: ${response.status}` }, { status: 400 });
    }

    const data = await response.json();
    console.log("Response data:", data)
    const result = data.tokens.map((token: any) => {
      return {
        contract: token.contract,
        name: token.name,
        symbol: token.symbol,
        price: token.price,
        total_supply: token.total_supply,
        onchain_market_cap: token.onchain_market_cap,
        change_24: token.change_24,
        market_cap: token.market_cap,
        volume_24h: token.volume_24h
      }
    })

    return NextResponse.json({ tokens: result });
  } catch (error) {
    console.error('Error token', error);
    return NextResponse.json({ error: 'Failed to token' }, { status: 500 });
  }
}
