export function getDomainFromCompany(companyName: string) {
  if (!companyName || companyName === "Unknown") return null;

  return companyName
    .toLowerCase()
    .replace(/[^a-z]/g, "") + ".com";
}