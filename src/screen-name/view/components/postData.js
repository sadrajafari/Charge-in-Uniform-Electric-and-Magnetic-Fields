export default async function post() {
  let url =
    "https://particleinuniformelecmag-default-rtdb.firebaseio.com/.json";
  let date = new Date();
  let data = { timestamp: date.toISOString() };
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => response.json());
}
