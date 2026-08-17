const COUNTRY_ALIASES = {
  "United States": ["US", "U.S.", "USA", "United States of America", "America"],
  Canada: ["CA", "CAN"],
  "United Kingdom": ["GB", "GBR", "UK", "Great Britain", "England", "Britain"],
  Australia: ["AU", "AUS"],
};

export function normalizeCountrySearchText(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s._-]/g, "")
    .replace(/^\+/, "");
}

function getCountryAliasesForOption(option) {
  const optionKey = String(option).trim();
  const aliases = new Set([optionKey]);

  for (const [countryName, countryAliases] of Object.entries(COUNTRY_ALIASES)) {
    if (countryName.toLowerCase() === optionKey.toLowerCase()) {
      aliases.add(countryName);
      for (const alias of countryAliases) {
        aliases.add(alias);
      }
    }

    if (countryAliases.some((alias) => alias.toLowerCase() === optionKey.toLowerCase())) {
      aliases.add(countryName);
      for (const alias of countryAliases) {
        aliases.add(alias);
      }
    }
  }

  return [...aliases];
}

export function canonicalizeCountryValue(value, options) {
  const candidate = String(value ?? "").trim();
  if (!candidate) {
    return value;
  }

  const exactMatch = options.find((option) => String(option).toLowerCase() === candidate.toLowerCase());
  if (exactMatch) {
    return exactMatch;
  }

  const normalizedCandidate = normalizeCountrySearchText(candidate);
  const match = options.find((option) =>
    getCountryAliasesForOption(option).some((variant) => normalizeCountrySearchText(variant) === normalizedCandidate),
  );

  return match ?? value;
}

export function isKnownCountry(value, options) {
  const candidate = String(value ?? "").trim();
  if (!candidate) {
    return false;
  }

  const exactMatch = options.some((option) => String(option).toLowerCase() === candidate.toLowerCase());
  if (exactMatch) {
    return true;
  }

  const normalizedCandidate = normalizeCountrySearchText(candidate);
  return options.some((option) =>
    getCountryAliasesForOption(option).some((variant) => normalizeCountrySearchText(variant) === normalizedCandidate),
  );
}