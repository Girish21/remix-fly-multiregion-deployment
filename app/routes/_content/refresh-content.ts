import { ActionFunction, json } from "remix";
import { promises } from "dns";

export const action: ActionFunction = async ({ request }) => {
  if (request.headers.get("auth") !== process.env.REFRESH_TOKEN) {
    return json({ message: "Not Authorised" }, { status: 401 });
  }

  const body = await request.text();
  const address = `global.${process.env.FLY_APP_NAME}.internal`;
  const ipv6s = await promises.resolve6(address);

  const urls = ipv6s.map((ip) => `http://[${ip}]:${process.env.PORT}`);

  const queryParams = new URLSearchParams();
  queryParams.set("_data", "routes/_content/update-content");

  const fetches = urls.map((url) =>
    fetch(`${url}/_content/update-content?${queryParams}`, {
      method: "POST",
      body,
      headers: {
        auth: process.env.REFRESH_TOKEN!,
        "content-type": "application/json",
        "content-length": Buffer.byteLength(body).toString(),
      },
    })
  );

  const response = await Promise.all(fetches);

  return json(response);
};
