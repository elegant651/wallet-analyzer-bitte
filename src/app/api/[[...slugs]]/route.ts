import { Pair } from "@/app/types";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api", aot: false })
  .use(swagger({
    documentation: {
      info: {
        title: 'Wallet Analyzer Documentation',
        version: '1.0.0'
      }
    }
  }))
  .get("/search/:token", async ({ params: { token } }) => {
    const apiUri = 'https://api.dexscreener.com/latest/dex/search?q='
    if (!token) {
      return {
        error: "Token not found",
      };
    }
    const tokenData = await fetch(apiUri + token)
    const tokenMatch = await tokenData.json()
    const pairs = tokenMatch.pairs.filter((pair: Pair) => pair.chainId === 'near')

    if (pairs.length === 0) {
      return {
        error: `Token ${token} not found`,
      };
    }

    //call to https://api.nearblocks.io/api-docs/#/FTs/get_v1_fts__contract_
    /*
{
  "contracts": [
    {
      "contract": "token.sweat",
      "name": "SWEAT",
      "symbol": "SWEAT",
      "decimals": 18,
      "icon": "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' rx='50' fill='%23FF0D75'/%3E%3Cg clip-path='url(%23clip0_283_2788)'%3E%3Cpath d='M39.4653 77.5455L19.0089 40.02L35.5411 22.2805L55.9975 59.806L39.4653 77.5455Z' stroke='white' stroke-width='10'/%3E%3Cpath d='M66.0253 77.8531L45.569 40.3276L62.1012 22.5882L82.5576 60.1136L66.0253 77.8531Z' stroke='white' stroke-width='10'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_283_2788'%3E%3Crect width='100' height='56' fill='white' transform='translate(0 22)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A",
      "reference": null,
      "price": "0.00824767",
      "change_24": "6.04487000",
      "market_cap": "63102074.00000000",
      "fully_diluted_market_cap": "176606488.00000000",
      "total_supply": "21395840400.859512859964823227",
      "volume_24h": "10651808.00000000",
      "description": "What is Sweat Economy?\r\nSweat Economy is a Web3 ecosystem on a mission to promote healthier lifestyles by encouraging people to move more. It is powered by $SWEAT or Sweat Token, a tokenized physical activity (crypto asset and the unit of physical activity value minted by steps). The token is managed via the intuitive non-custodial Sweat Wallet dApp. The Sweat Wallet is a top 5 dApp globally, designed for the crypto-curious.\r\n\r\nWhat is $SWEAT \r\n$SWEAT is a tokenized physical activity. Or in other words is a crypto asset and the unit of physical activity value minted by your steps.  $SWEAT is a top-10 Web3 asset globally by the number of holders and top-15 asset by the level of user activity.\r\n\r\nWhat is Sweat Wallet?\r\nSweat Wallet is a non-custodial mobile wallet dApp. Sweat Wallet enables millions of crypto-curious users to manage their $SWEAT and other crypto holdings–exchange, stake, vote, NFT game-play and more. It is designed from first principles to be the most intuitive and easy-to-use wallet in Web3.  Sweat Wallet is a top 5* dApp globally. *By number of unique active wallets (UAW) in 30d, as of July 2023\r\n\r\nHow is Sweat Wallet different from other mobile wallet dAPPs?\r\nSweat Wallet is on a mission to be the most intuitive wallet in Web3. Here’s how it’s done:\r\nLaunched as the biggest Web2-Web3 onboarding in history, with 13M wallets and counting\r\nLets you earn $SWEAT just for walking–the more you move, the more you earn\r\nEnables crypto-curious users to manage their $SWEAT and other crypto holdings \r\nSweat Wallet strives to be unique by being free to use. More specifically, there are no paywalls (as of time of writing) that prohibit users from joining. Instead of optimizing for profits, Sweat Wallet strives and prioritizes its mission of growth. \r\n\r\n",
      "twitter": "SweatEconomy",
      "facebook": "",
      "telegram": "sweateconomy",
      "reddit": "https://www.reddit.com/r/Sweateconomy/",
      "website": "https://sweateconomy.com/",
      "coingecko_id": "sweatcoin",
      "coinmarketcap_id": "21351",
      "livecoinwatch_id": "SWEAT",
      "onchain_market_cap": "176465830.99895697842974607358463109"
    }
  ]
}
  */

    return {
      pair: pairs[0],
    };
  })
  //https://api.nearblocks.io/api-docs/#/FTs/get_v1_fts
  .get("/toptoken", async () => {
    const apiUrl = `https://api.nearblocks.io/v1/fts`

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEARBLOCKS_API_KEY}`
        }
      });
      if (!response.ok) {
        return {
          error: `HTTP error! Status: ${response.status}`
        };
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

      return {
        tokens: result
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        tokens: []
      }
    }
  })
  //https://api.nearblocks.io/api-docs/#/FTs/get_v1_fts__contract__holders
  .get("/topholders/:contract", async ({ params: { contract } }) => {
    if (!contract) {
      return {
        error: "contract not found",
      };
    }
    //@TODO: holders count > https://api.nearblocks.io/api-docs/#/FTs/get_v1_fts__contract__holders_count

    //e.g: contract = "token.sweat"
    const apiUrl = `https://api.nearblocks.io/v1/fts/${contract}/holders`
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEARBLOCKS_API_KEY}`
        }
      });
      if (!response.ok) {
        return {
          error: `HTTP error! Status: ${response.status}`
        };
      }
      const data = await response.json();
      console.log("Response data:", data)

      return {
        data
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        data: null
      };
    }
  })
  //https://api.nearblocks.io/api-docs/#/Account/get_v1_account__account__activities
  .get("/activity/:account", async ({ params: { account } }) => {
    if (!account) {
      return {
        error: "account not found",
      };
    }

    const apiUrl = `https://api.nearblocks.io/v1/account/${account}/activities`

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEARBLOCKS_API_KEY}`
        }
      });
      if (!response.ok) {
        return {
          error: `HTTP error! Status: ${response.status}`
        };
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

      return {
        activities: result
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        activities: []
      }
    }
  })
  //https://api.nearblocks.io/api-docs/#/Txns/get_v1_txns__hash_
  .get("/getTxn/:txhash", async ({ params: { txhash } }) => {
    if (!txhash) {
      return {
        error: "txhash not found",
      };
    }

    const apiUrl = `https://api.nearblocks.io/v1/txn/${txhash}`

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEARBLOCKS_API_KEY}`
        }
      });
      if (!response.ok) {
        return {
          error: `HTTP error! Status: ${response.status}`
        };
      }
      const data = await response.json();
      console.log("Response data:", data)

      return {
        data
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        data: null
      };
    }
  })
  .compile();

export const GET = app.handle;
export const POST = app.handle;
