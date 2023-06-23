const { DateTime } = require("luxon");
const navigationPlugin = require('@11ty/eleventy-navigation');
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const Image = require("@11ty/eleventy-img");
const EleventyFetch = require("@11ty/eleventy-fetch");

// Markdown plugins
const md_brackets = require("markdown-it-bracketed-spans");
const md_attrs = require("markdown-it-attrs");
const md_container = require('markdown-it-container');
const md_deflist = require('markdown-it-deflist');
const md_footnote = require('markdown-it-footnote');
const md_figures = require('markdown-it-implicit-figures');
const md_gridtables = require('markdown-it-gridtables');
const md_sub = require('markdown-it-sub');
const md_sup = require('markdown-it-sup');
const md_lists = require('markdown-it-task-lists');
const md_texmath = require('markdown-it-texmath');
const md_katex = require('katex');
const md_mathjax3 = require('markdown-it-mathjax3');

module.exports = function(eleventyConfig) {
  // Universal Shortcodes (Adds to Liquid, Nunjucks, Handlebars)
  eleventyConfig.addShortcode("bgImg", function(imgName, test) {
    return `  style="background-image: url('./img/webp/${imgName}.webp');"`;
  });

  // blogposts collection
  eleventyConfig.addCollection("components", function (collection) {
    return collection.getFilteredByGlob("./src/components/*.njk").reverse();
  });

  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("./src/posts/*.md").reverse();
  });

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav"].indexOf(tag) === -1);
  }
  eleventyConfig.setDataDeepMerge(true);

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  }

  eleventyConfig.addFilter("filterTagList", filterTagList)
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addCollection("tagList", collection => {
    const tagsObject = {}
    collection.getAll().forEach(item => {
      if (!item.data.tags) return;
      item.data.tags
          .filter(tag => !['post', 'all'].includes(tag))
          .forEach(tag => {
            if(typeof tagsObject[tag] === 'undefined') {
              tagsObject[tag] = 1
            } else {
              tagsObject[tag] += 1
            }
          });
    });

    const tagList = []
    Object.keys(tagsObject).forEach(tag => {
      tagList.push({ tagName: tag, tagCount: tagsObject[tag] })
    })
    return tagList.sort((a, b) => b.tagCount - a.tagCount)

  });


  // Add a filter using the Config API
  eleventyConfig.addWatchTarget("./src/scss/");
  eleventyConfig.setBrowserSyncConfig({
    reloadDelay: 400
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addCollection('componentstotal', (collection) => {
    return collection.getFilteredByGlob('_components/**/*.njk');
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_brackets));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_attrs));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_container));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_deflist));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_footnote));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_figures));
  // eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_gridtables));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_sub));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_sup));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_lists));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_texmath));
  // eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_katex));
  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(md_mathjax3));

  return {
    dir: {
      input: "src",
      output: "dev"
    },
    pathPrefix: "/thephilosophyofshakespeare/"
  };


};
