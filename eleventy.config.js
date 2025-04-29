import fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

export default function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addWatchTarget("./src/**/*.{css,js,svg,png,jpeg}");
  eleventyConfig.addPassthroughCopy("./src/js/*");
  eleventyConfig.on("eleventy.before", async () => {
    const tailwindInputPath = path.resolve("./src/styles/global.css");
    const tailwindOutputPath = "./dist/styles/global.css";
    const cssContent = fs.readFileSync(tailwindInputPath, "utf8");
    const outputDir = path.dirname(tailwindOutputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await postcss([tailwindcss()]).process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  return {
    dir: { input: "src", output: "dist" },
  };
}
