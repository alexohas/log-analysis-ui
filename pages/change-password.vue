<template>
  <div
    class="d-flex justify-content-center align-items-center"
    style="height: 100vh"
  >
    <div class="col-12 col-md-4" style="height: 70vh;">
      <form @submit.prevent="submitLogin" class="px-5 card py-5">
        <div class="text-center mt-3">
          <h4>Welcome Back</h4>
          <h6>Enter your username and your new preferred password</h6>
        </div>
        <div class="form-group">
          <label for="">Username</label>
          <b-input v-model="login.username"></b-input>
        </div>

        <div class="form-group">
          <label for="">Password</label>
          <b-input-group class="">
            <b-input
              :type="type ? 'password' : 'text'"
              v-model="login.password"
            ></b-input>
            <b-input-group-append>
              <b-button type="button" @click="type = !type" variant="light">{{
                type ? "Show" : "Hide"
              }}</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
        <div class="form-group">
          <b-button type="submit" variant="outline-success">Submit</b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      type: true,
      login: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    ...mapActions("auth", ["resetPasswordFn"]),
    submitLogin: async function() {
      try {
        let response = await this.resetPasswordFn(this.login);
        this.$bvToast.toast(response.message, {
          title: "Completed",
          autoHideDelay: 5000,
          appendToast: true
        });
        this.$router.push("/");
      } catch (error) {
        this.$bvToast.toast(error.message, {
          title: "Request Failed",
          autoHideDelay: 5000,
          appendToast: true
        });
      }
    }
  }
};
</script>

<style scoped></style>
