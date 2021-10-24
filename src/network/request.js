import axios from "axios"
export function request(confing) {
  const instance = axios.create({
    baseURL: "https://lianghj.top:8888/api/private/v1/",
    timeout: 5000
  })
  instance.interceptors.request.use((confing) => {
    confing.headers.Authorization = window.sessionStorage.getItem("token")
    return confing
  })
  instance.interceptors.response.use((res) => {
    return res.data
  })
  return instance(confing)
}
