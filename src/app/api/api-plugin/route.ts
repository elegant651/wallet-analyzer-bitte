import { NextResponse } from "next/server";

const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}");

if (!key?.accountId) {
  console.error("no account");
}

export async function GET() {
  const pluginData = {
    openapi: "3.0.0",
    info: {
      "title": "Wallet Analyzer API",
      "description": "API for wallet analysis and interaction with various endpoints.",
      "version": "1.0.0"
    },
    servers: [
      {
        url: config.url,
      },
    ],
    "x-mb": {
      "account-id": key.accountId,
      assistant: {
        "name": "Wallet Analyzer API",
        "description": "API for wallet analysis and interaction with various endpoints.",
        "instructions": "You are an assistant that helps users interact with Wallet analyzer.",
        "tools": [
          {
            "type": "generate-transaction"
          }
        ]
      },
    },
    paths: {
      "/api/tools/search": {
        "get": {
          "summary": "Search Token",
          "description": "Fetch token data from Dexscreener based on the token name, symbol, or identifier.",
          operationId: "search",
          "parameters": [
            {
              "in": "query",
              "name": "token",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "The token name, symbol, or identifier to search for."
            }
          ],
          "responses": {
            "200": {
              "description": "Token data retrieved successfully.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "pair": {
                        "type": "object",
                        "description": "The matching token pair from Dexscreener.",
                        "additionalProperties": true
                      }
                    },
                    "required": [
                      "pair"
                    ]
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/toptoken": {
        "get": {
          "summary": "Get Top Tokens",
          "description": "Fetch top tokens data from the NEARBlocks API.",
          operationId: "toptoken",
          "responses": {
            "200": {
              "description": "Top tokens retrieved successfully.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "tokens": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "contract": {
                              "type": "string"
                            },
                            "name": {
                              "type": "string"
                            },
                            "symbol": {
                              "type": "string"
                            },
                            "price": {
                              "type": "string"
                            },
                            "total_supply": {
                              "type": "string"
                            },
                            "onchain_market_cap": {
                              "type": "string"
                            },
                            "change_24": {
                              "type": "string"
                            },
                            "market_cap": {
                              "type": "string"
                            },
                            "volume_24h": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/topholders": {
        "get": {
          "summary": "Get Top Holders",
          "description": "Fetch the list of holders for a specific token contract.",
          operationId: "topholders",
          "parameters": [
            {
              "in": "query",
              "name": "contract",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "The contract identifier of the token."
            }
          ],
          "responses": {
            "200": {
              "description": "Holders data retrieved successfully.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "data": {
                        "type": "object",
                        "additionalProperties": true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/activity": {
        "get": {
          "summary": "Get Account Activities",
          "description": "Fetch the activity history for a specific account.",
          operationId: "activity",
          "parameters": [
            {
              "in": "query",
              "name": "account",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "The account identifier to fetch activities for."
            }
          ],
          "responses": {
            "200": {
              "description": "Account activities retrieved successfully.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "activities": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "affected_account_id": {
                              "type": "string"
                            },
                            "involved_account_ids": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            },
                            "direction": {
                              "type": "string"
                            },
                            "cause": {
                              "type": "string"
                            },
                            "absolute_staked_amount": {
                              "type": "string"
                            },
                            "absolute_nonstaked_amount": {
                              "type": "string"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/getTxn": {
        "get": {
          "summary": "Get Transaction Details",
          "description": "Fetch details of a specific transaction by its hash.",
          operationId: "gettxn",
          "parameters": [
            {
              "in": "query",
              "name": "txhash",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "The transaction hash to look up."
            }
          ],
          "responses": {
            "200": {
              "description": "Transaction details retrieved successfully.",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "data": {
                        "type": "object",
                        "additionalProperties": true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
  };

  return NextResponse.json(pluginData);
}