import { request } from "./request"

export function getUsers(queryObj) {
  return request({
    url: "/users",
    method: "get",
    params: queryObj
  })
}

export function changeUser(uId, type) {
  return request({
    url: `/users/${uId}/state/${type}`,
    method: "put"
  })
}

export function addUser(addList) {
  return request({
    url: "users",
    method: "post",
    data: addList
  })
}

export function getUserInfo(id) {
  return request({
    url: `/users/${id}`,
    method: "get"
  })
}

export function editUserInfo(id, email, mobile) {
  return request({
    url: `/users/${id}`,
    method: "put",
    data: {
      email,
      mobile
    }
  })
}

export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: "delete"
  })
}

export function giveUserRole(id, roleId) {
  return request({
    url: `/users/${id}/role`,
    method: "put",
    data: roleId
  })
}
