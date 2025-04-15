export const base_url = "http://127.0.0.1:5000/api/";
// export const base_url = "http://192.168.1.8:5000/api/";
export const base_url_image = "http://127.0.0.1:5000/images/";
// export const base_url_image = "http://192.168.1.8:5000/images/";
// export const base_url = "https://cooperative-lion-sneakers.cyclic.app/api/";
const getTokenFromLocalStorage = localStorage.getItem("customer")
  ? JSON.parse(localStorage.getItem("customer"))
  : null;
// hj
export const config = {
  headers: {
    Authorization: `Bearer ${getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
    Accept: "application/json",
  },
};
