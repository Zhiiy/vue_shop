import { request } from "./request"

export function getRightsList(type) {
  return request({
    url: `/rights/${type}`,
    method: "get"
  })
}

export function getRolesList() {
  return request({
    url: "/roles",
    method: "get"
  })
}

export function addRoles(rolesList) {
  return request({
    url: "/roles",
    method: "post",
    data: rolesList
  })
}

export function getRole(id) {
  return request({
    url: `/roles/${id}`,
    method: "get"
  })
}

export function alterRoles(id, roleName, roleDesc) {
  return request({
    url: `/roles/${id}`,
    method: "put",
    data: {
      roleName,
      roleDesc
    }
  })
}

export function delRoles(id) {
  return request({
    url: `/roles/${id}`,
    method: "delete"
  })
}

export function delRoleRight(roleId, rightId) {
  return request({
    url: `/roles/${roleId}/rights/${rightId}`,
    method: "delete"
  })
}

export function allowRight(roleId, rightId) {
  return request({
    url: `/roles/${roleId}/rights`,
    method: "post",
    data: rightId
  })
}
