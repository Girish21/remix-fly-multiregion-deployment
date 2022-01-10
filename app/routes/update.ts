import { ActionFunction } from "remix";

export const action: ActionFunction = () => {
  console.log("called");

  return { ok: true };
};
