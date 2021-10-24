import { request } from "./request"

export function getLogin(username, password) {
  return request({
    url: "/login",
    method: "POST",
    params: {
      username,
      password
    }
  })
}
