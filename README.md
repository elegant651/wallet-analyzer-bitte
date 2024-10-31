# Wallet Analyzer Agent

#### API Base URL

https://wallet-analyzer-bitte.vercel.app


#### Endpoints

- Search tokens `GET` `/api/tools/search`

- Get Top tokens `GET` `/api/tools/toptoken`

- Get Top holders `GET` `/api/tools/topholders`

- Get tx info `GET` `/api/tools/get-txn`

- Get account activity `GET` `/api/tools/activity`


#### Usage

- toptoken : what's top trending tokens?
- search : give me the info about sweat
- topholders : analyze top holders for sweat
- activity: analyze account activity for hodl-lockup.sweat
- get-txn : give me txinfo about 3CT2mXeRDREv78qYoGvZoJGUB8iGU6rPKu5tctc9CsMf


### Installation

Set `NEAR_ENV="mainnet"` and `NEARBLOCKS_API_KEY` in your `.env.local` file.

```bash
# install dependencies
pnpm i

# start the development server
pnpm dev
```

