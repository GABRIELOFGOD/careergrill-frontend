const countryCodes = `
AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LU LT MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TW HK MO PS XK TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW
`.trim().split(/\s+/);

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export const countries = countryCodes
  .map((code) => ({
    code,
    name: code === "XK" ? "Kosovo" : regionNames.of(code) ?? code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const countryNames = countries.map(({ name }) => name);

const continentCountryCodes = {
  Africa: "DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW",
  Asia: "AF AM AZ BH BD BT BN KH CN CY GE HK IN ID IR IQ IL JP JO KZ KW KG LA LB MO MY MV MN MM NP KP KR OM PK PS PH QA SA SG LK SY TW TJ TH TL TR TM AE UZ VN YE",
  Europe: "AL AD AT BY BE BA BG HR CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA",
  "North America": "AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US",
  "South America": "AR BO BR CL CO EC GY PY PE SR UY VE",
  Oceania: "AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU",
} satisfies Record<string, string>;

export const countryContinents = Object.fromEntries(
  Object.entries(continentCountryCodes).map(([continent, codes]) => [
    continent,
    codes.split(" ").map((code) => countries.find((country) => country.code === code)?.name)
      .filter((name): name is string => name !== undefined),
  ]),
) as Record<keyof typeof continentCountryCodes, string[]>;

export function summarizeCountrySelection(value: string | readonly string[]): string {
  let selected = typeof value === "string" ? [value] : [...value];
  if (selected.length === 1) {
    try {
      const parsed: unknown = JSON.parse(selected[0]);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        selected = parsed;
      }
    } catch {
      // The value is a single legacy country name.
    }
  }

  const selectedCountries = new Set(selected.filter((name) => countryNames.includes(name)));
  if (selectedCountries.size === countryNames.length || selected.includes("All nationalities")) {
    return "All countries";
  }

  const matchedContinents = Object.entries(countryContinents)
    .filter(([, countriesInContinent]) => countriesInContinent.length > 0
      && countriesInContinent.every((country) => selectedCountries.has(country)));
  const countriesInMatchedContinents = new Set(matchedContinents.flatMap(([, list]) => list));
  const remainingCountries = [...selectedCountries]
    .filter((country) => !countriesInMatchedContinents.has(country));

  return [
    ...matchedContinents.map(([continent]) => continent),
    ...remainingCountries,
    ...selected.filter((name) => !countryNames.includes(name) && name !== "All nationalities"),
  ].join(", ");
}
