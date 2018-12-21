export const saveActivity = async (activityName: string): Promise<SaveActivityResponse> => {
  const rawResult = await fetch("api/activity", {
    method: "post",
    headers: {
      "Content-type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ "name": activityName }),
  });
  return parseToSaveActivityResponse(await rawResult.json())
}

function parseToSaveActivityResponse(input: any): SaveActivityResponse {
  let result: SaveActivityResponse = {
    hasError: false,
    errorMessage: "",
    activityUrl: ""
  }
  if (input.error) {
    result.hasError = true
    result.errorMessage = input.error
  } else {
    result.hasError = false
    result.activityUrl = input["url"]
  }
  return result
}

export interface SaveActivityResponse {
  hasError: boolean
  errorMessage: string
  activityUrl: string
}
