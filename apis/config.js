/* eslint-disable */
import axios from "axios";
import Vue from "vue";


var api = "https://cryptic-spire-82768.herokuapp.com";

if (process.env.NODE_ENV === 'development') {
    api = 'http://localhost:2021'
}
// Live Server
export const API = api;
console.log(API);

Vue.prototype.$API = API;

export var blackAxios = axios.create({
  baseURL: API
});
Vue.prototype.$blackAxios = blackAxios;
