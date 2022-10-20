const fetcher = async (license_key) => {
  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    body: new URLSearchParams({
      product_permalink: "datasciencetrivia",
      license_key: license_key,
    }),
  });
  return res.json();
};

export default fetcher;
