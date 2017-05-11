import fetch from 'isomorphic-fetch'

import { fetchData } from '../api/userApi'
// 请求相关的Actions
export const RECEIVE_USERS = 'RECEIVE_USERS'
export function receiveUsers(res) {
  return {
    type: RECEIVE_USERS,
    res
  }
}

export const RESET_USER_REQ = 'RESET_USER_REQ'
export function resetUserReq() {
  return {
    type: RESET_USER_REQ
  }
}

export const RECEIVE_SIGNUP_RES = 'RECEIVE_SIGNUP_RES'
export function receiveSignupRes(res) {
  return {
    type: RECEIVE_SIGNUP_RES,
    res
  }
}

export const RECEIVE_LOG_RES = 'RECEIVE_LOG_RES'
export function receiveLogRes(res) {
  return {
    type: RECEIVE_LOG_RES,
    res
  }
}

export const RECEIVE_MANAGECODE = 'RECEIVE_MANAGECODE'
export function receiveManagecode(res) {
  return {
    type: RECEIVE_MANAGECODE,
    res
  }
}

export const RECEIVE_USER_MESSAGE = 'RECEIVE_USER_MESSAGE'
export function receiveUserMessage(res) {
  return {
    type: RECEIVE_USER_MESSAGE,
    res
  }
}

export const RECEIVE_BORROWED = 'RECEIVE_BORROWED'
export function receiveBorrowed(res) {
  return {
    type: RECEIVE_BORROWED,
    res
  }
}

export const fetchUserData = fetchData
