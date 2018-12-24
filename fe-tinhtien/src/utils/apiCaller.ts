export default function callApi(
  url: string,
  method: string = "GET",
  body?: any
) {
  return fetch(url, {
    method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });
}
