export default function callApi(
  url: string,
  method: string,
  body?: any
) {
  return fetch(url, {
    method,
    headers: {
      "Content-type": "application/json",
      Accept: "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  }).then(
    rawResult => { return rawResult.json() }
  );
}

export function addData(url: string, body?: any): Promise<any> {
  return callApi(url, "POST", body);
}

export function updateData(url: string, body?: any): Promise<any> {
  return callApi(url, "PUT", body);
}

export function getData(url: string, body?: any): Promise<any> {
  return callApi(url, "GET", body);
}

export function deleteData(url: string, body?: any): Promise<any> {
  return callApi(url, "DELETE", body);
}
