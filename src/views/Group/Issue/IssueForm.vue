<template>
  <div class="modal-container">
    <div style="text-align: right;">
      <i class="fa fa-times clickable" @click="$store.commit('closeModal')"></i>
    </div>
    <h3>이슈 만들기</h3>
    <form @submit="addIssue">
      <div class="field">
        <label>이슈명</label>
        <input type="text" v-model="issue.name" required />
      </div>
      <div class="field">
        <label>내용</label>
        <textarea v-model="issue.description" required></textarea>
      </div>
      <div class="field">
        <label>책임자</label>
        <input type="text" v-model="issue.assignee" />
      </div>
      <div class="field">
        <label>기한</label>
        <input type="date" v-model="issue.dueDate" />
      </div>
      <div class="footer-btn-group">
        <button>만들기</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from "firebase";
import { now } from "../../../utils";

export default {
  data() {
    return {
      issue: {
        name: "",
        description: "",
        assignee: "",
        dueDate: ""
      }
    };
  },

  methods: {
    addIssue() {
      firebase
        .firestore()
        .collection("group")
        .doc(this.$route.params.groupId)
        .collection("issue")
        .doc()
        .set({
          name: this.issue.name,
          description: this.issue.description,
          assignee: this.issue.assignee || this.$store.state.currentUser.email,
          dueDate: this.issue.dueDate || now(),
          status: "todo",
          reporter: this.$store.state.currentUser.email
        })
        .then(() => {
          this.$store.commit("closeModal");
          this.issue = {};
          this.$store.commit("toggleReloadIssueBoard");
        });
    }
  }
};
</script>

<style></style>
