<template>
  <div class="py-5">
    <b-nav pills align="center">
      <b-nav-item
        class="mx-1"
        to="?tab=search"
        :active="$route.query.tab === 'search'"
        >Search</b-nav-item
      >
      <b-nav-item
        class="mx-1"
        to="?tab=logs"
        :active="$route.query.tab === 'logs'"
        >Existing Logs</b-nav-item
      >

      <b-nav-item to="?tab=profile" class="mx-1 text-capitalize" active>
        {{ userInfo.name ? userInfo.name : userInfo.username }}
      </b-nav-item>
      <b-nav-item class="mx-1" @click="logoutAccount">
        Logout
      </b-nav-item>
    </b-nav>

    <div
      v-if="$route.query.tab === 'search'"
      class="d-flex justify-content-center flex-column"
    >
      <div class="d-flex justify-content-center">
        <form class="mt-5 col-12 col-md-6" @submit.prevent="search">
          <b-input-group size="md" class="mb-2">
            <b-form-input
              v-model="q"
              type="search"
              placeholder="Search the logs with questions like how many errors and other questions about statistics"
            ></b-form-input>
            <b-input-group-append is-text>
              <b-icon-search></b-icon-search>
            </b-input-group-append>
          </b-input-group>
        </form>
      </div>
      <div class="d-flex justify-content-center">
        <div class="col-12 col-md-6 ">
          <b-alert :show="message.length > 0" variant="success">{{
            message
          }}</b-alert>
        </div>
      </div>
    </div>

    <div
      v-if="$route.query.tab === 'logs'"
      class="d-flex justify-content-center flex-column px-5 mx-5"
    >
      <div class="d-flex justify-content-end align-items-center mb-3">
        <b-button @click="rightDrawer = true" variant="success"
          >Upload More Logs</b-button
        >
      </div>
      <div class="d-flex justify-content-center">
        <div class="card px-2 text-center py-5 mx-3">
          <h4>Error Logs</h4>
          <h5>{{ stats.errorCount }}</h5>
        </div>
        <div class="card px-2 text-center py-5 mx-3">
          <h4>Notice Logs</h4>
          <h5>{{ stats.infoCount }}</h5>
        </div>
        <div class="card px-2 text-center py-5 mx-3">
          <h4>Total Logs</h4>
          <h5>{{ stats.errorCount + stats.infoCount }}</h5>
        </div>
      </div>
    </div>

    <div
      v-if="$route.query.tab === 'profile'"
      class="d-flex justify-content-center flex-column mt-5 px-5 mx-5"
    >
      <div class="d-flex justify-content-center">
        <div class="border col-12 col-md-6 px-5 py-5 mx-3">
          <h4>Update Username</h4>
          <form @submit.prevent="submitUser">
            <div class="form-group">
              <label for="">Username</label>
              <b-input-group class="">
                <b-input :type="'text'" v-model="user.username"></b-input>
              </b-input-group>
            </div>
            <div class="form-group">
              <label for="">Full name</label>
              <b-input-group class="">
                <b-input :type="'text'" v-model="user.name"></b-input>
              </b-input-group>
            </div>
            <div class="form-group">
              <b-button type="submit" variant="outline-success">Save</b-button>
            </div>
          </form>
        </div>
      </div>
      <div class="d-flex mt-3 justify-content-center">
        <div class="border col-12 col-md-6 px-5 py-5 mx-3">
          <h4>Update Password</h4>
          <form @submit.prevent="submitLogin">
            <div class="form-group">
              <label for="">Password</label>
              <b-input-group class="">
                <b-input
                  :type="type ? 'password' : 'text'"
                  v-model="update.password"
                ></b-input>
                <b-input-group-append>
                  <b-button
                    type="button"
                    @click="type = !type"
                    variant="light"
                    >{{ type ? "Show" : "Hide" }}</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </div>
            <div class="form-group">
              <b-button type="submit" variant="outline-success">Save</b-button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <b-sidebar
      id="sidebar-right"
      v-model="rightDrawer"
      title="Upload"
      right
      shadow
    >
      <div class="px-3 py-2">
        <p>
          Upload new apache log file. Upload one at a time
        </p>
        <b-form-file v-model="file" accept=".txt">
          <template slot="file-name" slot-scope="{ names }">
            <b-badge variant="dark">{{ names[0] }}</b-badge>
            <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
              + {{ names.length - 1 }} More files
            </b-badge>
          </template>
        </b-form-file>
        <b-button @click="uploadFile" class="mt-3" variant="success">
          <b-spinner v-if="loading" label="Spinning"></b-spinner>
          <span v-else>Upload</span>
        </b-button>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import { searchFunction, statsFunction, uploadFunction } from "@/apis/index.js";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      active: this.$route.query.tab,
      q: "",
      rightDrawer: false,
      message: "",
      loading: false,
      file: null,
      user: {
        username: "",
        name: ""
      },
      update: {
        password: "",
        username: ""
      },
      type: true,
      stats: {
        info: 0,
        error: 0
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["userInfo", "accessCreds"])
  },
  mounted() {
    if (!this.accessCreds || this.accessCreds.length === 0) {
      this.$router.push("/");
    } else {
      this.user = { ...this.userInfo };
    }
    if (this.$route.query.tab === "logs") {
      this.getStats();
    }
  },
  watch: {
    "$route.query.tab": async function(val) {
      if (val === "logs") {
        this.getStats();
      }
    }
  },
  methods: {
    search: async function() {
      try {
        this.message = "";
        let result = await searchFunction(`?q=${this.q}`);
        console.log(result);
        this.message = result.message;
      } catch (error) {
        console.log(error.message);
      }
    },
    getStats: async function() {
      try {
        let result = await statsFunction();
        this.stats = result.stats;
      } catch (error) {
        console.log(error.message);
      }
    },
    uploadFile: async function() {
      try {
        let fd = new FormData();
        fd.append("file", this.file);
        this.loading = true;
        let result = await uploadFunction(fd);
        this.file = null;
        await this.getStats();
        this.rightDrawer = false;
        this.loading = false;
      } catch (error) {
        console.log(error.message);
      }
    },
    logoutAccount() {
      this.$router.push("/");
    },
    submitUser: async function() {
      try {
        let update = {
          username: this.user.username,
          name: this.user.name,
          id: this.user._id
        };
        let response = await this.updateAccountFunction(update);
        this.$bvToast.toast(response.message, {
          title: "Completed",
          autoHideDelay: 5000,
          appendToast: true
        });
        this.user = { ...this.userInfo };
      } catch (error) {
        this.$bvToast.toast(error.message, {
          title: "Request Failed",
          autoHideDelay: 5000,
          appendToast: true
        });
      }
    },
    ...mapActions("auth", ["resetPasswordFn", "updateAccountFunction"]),
    submitLogin: async function() {
      try {
        this.update.username = this.userInfo.username;
        let response = await this.resetPasswordFn(this.update);
        this.$bvToast.toast(response.message, {
          title: "Completed",
          autoHideDelay: 5000,
          appendToast: true
        });
        this.update.password = "";
        this.update.username = "";
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

<style scoped>
.card {
  width: 200px;
  height: 200px;
}
</style>
