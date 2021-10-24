import { request } from "./request"

export function getOrders(queryObj) {
  return request({
    url: "/orders",
    method: "get",
    params: queryObj
  })
}

export function getLogistics(id) {
    return request({
      url: `/kuaidi/${id}`,
      method: "get",
    })
  }