import neo4j, { Driver } from 'neo4j-driver';

// Ensure we don't create multiple connections during Next.js hot-reloads in development
const globalForNeo4j = globalThis as unknown as {
  neo4jDriver: Driver | undefined;
};

const uri = process.env.NEO4J_URI as string;
const username = process.env.NEO4J_USERNAME as string;
const password = process.env.NEO4J_PASSWORD as string;

if (!uri || !username || !password) {
  console.warn("⚠️ Neo4j environment variables are missing. Check your .env file.");
}

export const driver =
  globalForNeo4j.neo4jDriver ??
  neo4j.driver(
    uri,
    neo4j.auth.basic(username, password),
    { disableLosslessIntegers: true } // Makes working with JavaScript numbers easier
  );

if (process.env.NODE_ENV !== 'production') {
  globalForNeo4j.neo4jDriver = driver;
}

/**
 * A handy utility function to run a Cypher query and automatically close the session
 */
export async function runQuery(cypher: string, params: Record<string, any> = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}