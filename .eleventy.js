module.exports = function(eleventyConfig, config = {}) {
  // Support pathPrefix from environment or config
  const pathPrefix = process.env.PATH_PREFIX || config.pathPrefix || "/";
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Date filter for footer year
  eleventyConfig.addFilter("date", function(date, format) {
    if (format === "%Y") {
      return new Date().getFullYear();
    }
    return date;
  });

  return {
    pathPrefix: pathPrefix,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
