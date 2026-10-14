/**
 * Actualiza `src/data/github-stats.json` con la API GraphQL de GitHub antes del
 * build: repos públicos propios y contribuciones del último año de Eidan210.
 * Sin token, o si la API falla, conserva las últimas cifras guardadas y el
 * build sigue: una cifra un poco vieja es mejor que un despliegue roto.
 *
 * En CI usa el token del workflow (`GITHUB_TOKEN`); en local:
 *   GITHUB_TOKEN=<token> node scripts/github-stats.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../src/data/github-stats.json", import.meta.url);
const LOGIN = "Eidan210";
const QUERY = `query($login: String!) {
  user(login: $login) {
    repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
    contributionsCollection { contributionCalendar { totalContributions } }
  }
}`;

const saved = JSON.parse(readFileSync(FILE, "utf8"));

try {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("sin GITHUB_TOKEN");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "portafolio-junior" },
    body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
    signal: AbortSignal.timeout(15_000),
  });
  const body = await res.json().catch(() => null);
  const user = body?.data?.user;
  const repos = user?.repositories?.totalCount;
  const contributions = user?.contributionsCollection?.contributionCalendar?.totalContributions;
  if (!res.ok || !Number.isInteger(repos) || !Number.isInteger(contributions)) {
    throw new Error(`respuesta inesperada (HTTP ${res.status}): ${JSON.stringify(body?.errors ?? body).slice(0, 200)}`);
  }
  const next = { repos, contributions, updatedAt: new Date().toISOString().slice(0, 10) };
  writeFileSync(FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`github-stats: ${repos} repos públicos · ${contributions} contribuciones (antes ${saved.repos} · ${saved.contributions})`);
} catch (err) {
  console.warn(`github-stats: se conservan las cifras del ${saved.updatedAt} (${err instanceof Error ? err.message : err})`);
}
