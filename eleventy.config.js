import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

export default function (eleventyConfig) {
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addWatchTarget("./src/assets/**/*.{css,js,svg,png,jpeg}");
  eleventyConfig.addPassthroughCopy("./src/js/*");
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    async compile(inputContent, inputPath) {
      return async () => {
        const result = await postcss([tailwindcss()]).process(inputContent, {
          from: inputPath,
        });
        return result.css;
      };
    },
  });
}

export const config = {
  dir: {
    input: "src",
    output: "dist",
  },
};
