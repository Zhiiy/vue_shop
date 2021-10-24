import { request } from "./request"

export function getCateList(cateObj) {
  return request({
    url: "/categories",
    method: "get",
    params: cateObj
  })
}

export function addCate(addCateObj) {
  return request({
    url: "/categories",
    method: "post",
    data: addCateObj
  })
}

export function getCateInfo(id) {
  return request({
    url: `/categories/${id}`,
    method: "get"
  })
}

export function editCateInfo(id, name) {
  return request({
    url: `/categories/${id}`,
    method: "put",
    data: {
      cat_name: name
    }
  })
}

export function delCate(id) {
  return request({
    url: `/categories/${id}`,
    method: "delete"
  })
}

export function getAttr(id, sel) {
  return request({
    url: `/categories/${id}/attributes`,
    method: "get",
    params: {
      sel
    }
  })
}

export function delAttr(id, attrid) {
  return request({
    url: `/categories/${id}/attributes/${attrid}`,
    method: "delete"
  })
}

export function getAttrInfo(id, attrid) {
  return request({
    url: `/categories/${id}/attributes/${attrid}`,
    method: "get"
  })
}

export function editAttrInfo(id, attrid, editObj) {
  return request({
    url: `/categories/${id}/attributes/${attrid}`,
    method: "put",
    data: editObj
  })
}

export function addAttr(id, addObj) {
  return request({
    url: `/categories/${id}/attributes`,
    method: "post",
    data: addObj
  })
}

export function addAttrVal(id, attrId, valObj) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: "put",
    data: valObj
  })
}

export function getGoodsList(queryObj) {
  return request({
    url: "/goods",
    method: "get",
    params: queryObj
  })
}

export function delGoods(goodsId) {
  return request({
    url: `/goods/${goodsId}`,
    method: "delete"
  })
}

export function addGoods(goodsInfo) {
  return request({
    url: "/goods",
    method: "post",
    data: goodsInfo
  })
}
