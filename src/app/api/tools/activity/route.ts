import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get('account');

    if (!account) {
      return NextResponse.json({ error: `account not found` }, { status: 400 });
    }
    const apiUrl = `https://api.nearblocks.io/v1/account/${account}/activities`

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
    const result = data.activities.map((activity: any) => {
      return {
        affected_account_id: activity.affected_account_id,
        involved_account_ids: activity.involved_account_ids,
        direction: activity.direction,
        cause: activity.cause,
        absolute_staked_amount: activity.absolute_staked_amount,
        absolute_nonstaked_amount: activity.absolute_nonstaked_amount,
      }
    })

    return NextResponse.json({ activities: result });
  } catch (error) {
    console.error('Error token', error);
    return NextResponse.json({ error: 'Failed to token' }, { status: 500 });
  }
}
