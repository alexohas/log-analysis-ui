import { loginFunction, resetPasswordFunction, updateFunction} from "@/apis/index.js";
export default {
    state: () => ({
        userInfo: {},
        accessCreds: ""
    }),

    getters: {
        userInfo: state=>state.userInfo,
        accessCreds: state=>state.accessCreds
    },
    mutations: {
        updateUserInfo(state, user) {
            state.userInfo = user
        },
        updateAccessCreds(state, creds) {
            state.accessCreds = creds
        },
        logUserOut(state) {
            state.accessCreds = null
            state.userInfo = null
        }
    },
    actions: {
        loginFn: async function ({ state, commit }, args) {
            try {
                let response = await loginFunction(args)
                commit("updateUserInfo", response.account)
                commit("updateAccessCreds", response.token)
                return response
            } catch (error) {
                if (error.response && error.response.data) {
                    throw new Error(error.response.data.message)
                } else {
                    throw new Error(error.message)
                }
            }
        },
        updateAccountFunction: async function ({ state, commit }, payload) {
            try {
                let response = await updateFunction(payload)
                commit("updateUserInfo", response.account)
                return response
            } catch (error) {
                if (error.response && error.response.data) {
                    throw new Error(error.response.data.message)
                } else {
                    throw new Error(error.message)
                }
            }
        },
        
        resetPasswordFn: async function ({ state, commit }, payload) {
            try {
                let response = await resetPasswordFunction(payload)
                return response
            } catch (error) {
                if (error.response && error.response.data) {
                    throw new Error(error.response.data.message)
                } else {
                    throw new Error(error.message)
                }
            }
        },
    }
}
