function AddSitemapToRedirectsWebpackPlugin() {
  return {
    apply: compiler => {
      compiler.hooks.emit.tapPromise(
        "AddSitemapToRedirectsWebpackPlugin",
        emit
      );
    },
  };
}

function emit(compilation) {
  return new Promise(resolve => {
    const tenant = process.env.SCRIVITO_TENANT;
    const url = process.env.URL;

    if (url && tenant) {
      const previousRedirects = compilation.assets["_redirects"]
        .source()
        .toString();
      const redirects = addSitemapToRedirects(tenant, url, previousRedirects);

      compilation.assets["_redirects"] = {
        source: () => redirects,
        size: () => redirects.length,
      };
    }

    resolve();
  });
}

function addSitemapToRedirects(tenant, url, previousRedirects) {
  return `
##
# Sitemap redirect rules
##
/_sitemaphtml /_sitemap.html 200
/sitemap.xml https://api.scrivito.com/tenants/${tenant}/extract_content?src_url=${encodeURIComponent(url)}%2F_sitemaphtml%3F_escaped_fragment_%3D0 302

${previousRedirects}`;
}

module.exports = AddSitemapToRedirectsWebpackPlugin;
