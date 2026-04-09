import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const projectRoot = process.cwd();
const sourceFile = resolve(projectRoot, "docs/calendar.tsp");
const tempFile = resolve(projectRoot, ".generated/calendar.tsp");

mkdirSync(dirname(tempFile), { recursive: true });

const cleaned = readFileSync(sourceFile, "utf8")
  .replace(/\u00a0/g, " ")
  .replace(/@service\(\{/g, "@service(#{")
  .replace(/\r\n/g, "\n")
  .split("\n")
  .filter(
    (line) =>
      !line.startsWith("Твоя задача:") &&
      !line.startsWith("используем свежие версии"),
  )
  .join("\n")
  .trimEnd()
  .concat("\n");

writeFileSync(tempFile, cleaned, "utf8");

try {
  execFileSync(
    "tsp",
    ["compile", tempFile, "--config", resolve(projectRoot, "tspconfig.yaml")],
    {
      cwd: projectRoot,
      stdio: "inherit",
    },
  );
} finally {
  rmSync(tempFile, { force: true });
}
