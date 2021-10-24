import { request } from "./request"

export function getHomeMenu() {
  return request({
    method: "get",
    url: "/menus"
  })
}
