<template>
  <div class="container w-100">
    <div class="w-100">
      <div class="links">
        <h2>
          Natural Language Processing Applied to system log analysis with
          emphasis on Apache Server Log files
        </h2>
        <form class="mt-5" @submit.prevent="search">
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

        <b-alert :show="message.length > 0" variant="success">{{
          message
        }}</b-alert>
      </div>
    </div>
  </div>
</template>

<script>
import { searchFunction } from "@/apis/index.js";
export default {
  data() {
    return {
      q: "",
      message: ""
    };
  },
  methods: {
    search: async function() {
      try {
        this.message = "";
        let result = await searchFunction(`?q=${this.q}`);
        this.message = result.message;
      } catch (error) {
        console.log(error.message);
      }
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
