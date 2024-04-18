import { rm } from "node:fs/promises";
import { type Options, build, type Format } from "tsup";

export async function buildPackage({
  outputPath,
  overrides,
  entry,
  declaration,
  format,
  sourceMap,
  tsconfig,
}: {
  outputPath: string;
  entry?: string | readonly string[] | undefined;
  format?: Format | readonly Format[] | undefined;
  tsconfig?: string | undefined;
  declaration?: boolean | undefined;
  sourceMap?: boolean | "inline" | undefined;
  overrides?: Options | readonly Options[] | undefined;
}) {
  let success = true;
  // Avoid cleaning the outputPath if misconfigured.
  if (outputPath.includes("dist") || outputPath.includes("build")) {
    await rm(outputPath, { force: true, recursive: true });
  }
  const configs = Array.isArray(overrides) ? overrides : [overrides];
  const results = await Promise.allSettled(
    configs.map((config) =>
      build({
        // entry
        ...(entry && {
          entry: Array.isArray(entry) ? entry : [entry],
        }),

        format: format ?? "esm",
        outDir: outputPath,
        tsconfig: tsconfig,
        dts: declaration,
        sourcemap: sourceMap,
        skipNodeModulesBundle: true,

        ...config,
      }),
    ),
  );
  for (const result of results) {
    if (result.status === "rejected") {
      success = false;
      console.error(result.reason.message);
    }
  }
  return success;
}
