# Wallet Analyzer Agent

## Project Walkthrough


#### API Base URL

https://ref-finance-agent.vercel.app

#### Endpoints

- Token Metadata `GET` `/api/token/{token}`

- Swap Transactions `GET` `/api/swap/{tokenIn}/{tokenOut}/{quantity}`

#### Usage
Make LLM requests to the endpoints above. Refer to the full API documentation for detailed parameter and response information.


### Installation

Set `NEAR_ENV="mainnet"` in your `.env.local` file.

```bash
# install dependencies
pnpm i

# start the development server
pnpm dev
```

