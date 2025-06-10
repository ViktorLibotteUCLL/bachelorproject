export default function formatTimestamp(isoString: string) {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // "Dec"
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0"); // "13"
  const minutes = String(date.getMinutes()).padStart(2, "0"); // "05"

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}
