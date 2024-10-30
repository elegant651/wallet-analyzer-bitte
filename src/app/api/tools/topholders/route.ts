import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contract = searchParams.get('contract');

    if (!contract) {
      return NextResponse.json({ error: `contract not found` }, { status: 400 });
    }
    const apiUrl = `https://api.nearblocks.io/v1/fts/${contract}/holders`

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

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error token', error);
    return NextResponse.json({ error: 'Failed to token' }, { status: 500 });
  }
}