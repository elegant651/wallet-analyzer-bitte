import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col p-2">
      <h1 className="text-3xl font-bold">
        Wallet Analyzer Agent
      </h1>
      <ul>
        <li>
          <Link href="/.well-known/ai-plugin.json">
            OpenAPI Spec
          </Link>
        </li>
        {/* <li>
          <Link href="/api/swagger">
            Swagger
          </Link>
        </li> */}
      </ul>
    </main>
  );
}
