import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import router from "./router";

Vue.use(Vuex);
// {{$store.state.currentTitle}}
export default new Vuex.Store({
  state: {
    isTurnOff: false,
    modalInnerComponent: null,
    reloadIssueBoard: false,
    snackbarText: "",
    isSnackbarUp: false,
    snackbarText: "",
    group: null,
    currentUser: null,
  },
  getters: {
    group: (state) => ({ ...state.group }),
  },
  mutations: {
    setUser(state, user) {
      state.currentUser = user;
    },
    setGroup(state, group) {
      state.group = group;
    },
    toggleReloadIssueBoard(state) {
      state.reloadIssueBoard = !state.reloadIssueBoard;
    },
    turnOff(state) {
      state.isTurnOff = true;
    },
    turnOn(state) {
      state.isTurnOff = false;
    },
    openModal(state, component) {
      state.modalInnerComponent = component;
      state.isTurnOff = true;
    },
    closeModal(state) {
      state.isTurnOff = false;
      state.modalInnerComponent = null;
    },
    showSnackbar(state) {
      state.isSnackbarUp = true;
    },
    setSnackbarText(state, text) {
      state.snackbarText = text;
    },
    hideSnackbar(state) {
      state.isSnackbarUp = false;
    },
  },
  actions: {
    signIn(context, inputData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(inputData.email, inputData.password)
        .then(( userCredential ) => {
          context.commit("setUser", userCredential.user.toJSON());
          router.go(-1);
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    signOut(context) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          context.commit("setUser", null);
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    snackbar(context, text) {
      context.commit("setSnackbarText", text);
      context.commit("showSnackbar");
      setTimeout(() => {
        context.commit("hideSnackbar");
      }, 3000);
      setTimeout(() => {
        context.commit("setSnackbarText", "");
      }, 4000);
    },
    getGroupById(context, id) {
      firebase
        .firestore()
        .collection("group")
        .doc(id)
        .get()
        .then((doc) => {
          context.commit("setGroup", { id: doc.id, ...doc.data() });
        });
    },
    updateGroup(context, data) {
      firebase
        .firestore()
        .collection("group")
        .doc(context.state.group.id)
        .set(data)
        .then(() => {
          context.dispatch("snackbar", "저장되었습니다.");
          context.dispatch("getGroupById", context.state.group.id);
        });
    },
    deleteGroup(context, id) {
      firebase
        .firestore()
        .collection("group")
        .doc(id)
        .delete()
        .then(() => {
          context.dispatch("snackbar", "삭제되었습니다.").then(
            setTimeout(() => {
              router.push({ path: "/Group" });
            }, 3000)
          );
        });
    },
  },
});
