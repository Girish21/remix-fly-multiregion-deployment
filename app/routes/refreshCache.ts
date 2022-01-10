import { ActionFunction } from "remix";
import { promises } from "dns";

export const action: ActionFunction = async ({ request }) => {
  let address = `global.${process.env.FLY_APP_NAME}.internal`;
  let ipv6s = await promises.resolve6(address);

  const urls = ipv6s.map((ip) => `http://[${ip}]:${process.env.PORT}`);

  const fetches = urls.map((url) => fetch(`${url}/update`, { method: "POST" }));

  await Promise.all(fetches);

  return { ok: true };
};
