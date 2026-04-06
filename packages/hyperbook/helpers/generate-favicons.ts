import path from "path";
import fs from "fs/promises";
import { makeDir } from "./make-dir";
import { rrennAIbookJson } from "@rrennAIbook/types";

export async function generateFavicons(
  logoPath: string,
  outputDir: string,
  rrennAIbookConfig: rrennAIbookJson,
  assetsFolder: string,
): Promise<void> {
  // Dynamic import to avoid bundling issues with sharp
  const { favicons } = await import("favicons");
  
  // Construct the favicon path relative to the base path
  const faviconPath = path.posix.join(
    rrennAIbookConfig.basePath || "/",
    assetsFolder,
    "favicons"
  );
  
  const config = {
    path: faviconPath,
    appName: rrennAIbookConfig.name,
    appShortName: rrennAIbookConfig.name,
    appDescription: rrennAIbookConfig.description || rrennAIbookConfig.name,
    developerName: rrennAIbookConfig.author?.name,
    developerURL: rrennAIbookConfig.author?.url,
    lang: rrennAIbookConfig.language || "en",
    background: "#fff",
    theme_color: rrennAIbookConfig.colors?.brand || "#007864",
    display: "standalone",
    orientation: "any",
    scope: rrennAIbookConfig.basePath || "/",
    start_url: rrennAIbookConfig.basePath || "/",
    version: "1.0",
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      favicons: true,
      windows: false,
      yandex: false,
    },
  };

  const response = await favicons(logoPath, config);

  // Create output directory for favicons
  const faviconsDir = path.join(outputDir, assetsFolder, "favicons");
  await makeDir(faviconsDir, { recursive: true });

  // Write favicon image files
  for (const file of response.images) {
    await fs.writeFile(path.join(faviconsDir, file.name), file.contents);
  }

  // Write manifest and other files
  for (const file of response.files) {
    await fs.writeFile(path.join(faviconsDir, file.name), file.contents);
  }

  // Also copy favicon.ico to the root for backward compatibility
  const faviconIco = response.images.find(img => img.name === "favicon.ico");
  if (faviconIco) {
    await fs.writeFile(path.join(outputDir, "favicon.ico"), faviconIco.contents);
  }
}
