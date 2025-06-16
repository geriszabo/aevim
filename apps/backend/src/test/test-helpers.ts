
import app from "../index"
import { loginrequest, signupRequest } from "./test-request-helpers";

export async function loginFlow() {
  await app.fetch(signupRequest());
  const loginRes = await app.fetch(loginrequest());
  const cookie = loginRes.headers.get("Set-Cookie");
  return { loginRes, cookie };
}
