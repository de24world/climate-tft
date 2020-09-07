import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import router from "./router";

Vue.use(Vuex);
// {{$store.state.currentTitle}}
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state: {
    isTurnOff: false,
    modalInnerComponent: null,
    reloadIssueBoard: false,
    reloadGroup: false,
    reloadDepartment: false,
    snackbarText: "",
    isSnackbarUp: false,
    group: null,
    department: null,
    currentUser: null,
    containerType: "normal"
  },
  getters: {
    group: state => ({ ...state.group }),
    department: state => ({ ...state.department })
  },
  mutations: {
    setUser(state, user) {
      state.currentUser = user;
    },
    setGroup(state, group) {
      state.group = group;
    },
    setDepartment(state, department) {
      state.department = department;
    },
    toggleReloadIssueBoard(state) {
      state.reloadIssueBoard = !state.reloadIssueBoard;
    },
    toggleReloadGroup(state) {
      state.reloadGroup = !state.reloadGroup;
    },
    toggleReloadDepartment(state) {
      state.reloadDepartment = !state.reloadDepartment;
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
    }
  },
  actions: {
    signIn(context, inputData) {
      firebase
        .auth()
        .signInWithEmailAndPassword(inputData.email, inputData.password)
        .then(userCredential => {
          context.commit("setUser", userCredential.user.toJSON());
          router.push({ path: "/" });
        })
        .catch(err => {
          alert(err.message);
        });
    },
    signOut(context) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          context.commit("setUser", null);
          router.push({ path: "/" });
        })
        .catch(err => {
          alert(err.message);
        });
    },
    signUp(context, inputData) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(inputData.email, inputData.password)
        .then(user => {
          console.log(user);
          context.dispatch("signIn", inputData);
          context.dispatch("setUser", {
            name: inputData.name,
            email: inputData.email,
            uid: user.user.uid
          });
        })
        .catch(err => {
          alert(err.message);
        });
    },
    setUser(context, inputData) {
      firebase
        .firestore()
        .collection("users")
        .doc()
        .set(inputData);
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
        .then(doc => {
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
    // department
    getDepartmentById(context, id) {
      firebase
        .firestore()
        .collection("department")
        .doc(id)
        .get()
        .then(doc => {
          context.commit("setDepartment", { id: doc.id, ...doc.data() });
        });
    },
    updateDepartment(context, data) {
      firebase
        .firestore()
        .collection("department")
        .doc(context.state.department.id)
        .set(data)
        .then(() => {
          context.dispatch("snackbar", "저장되었습니다.");
          context.dispatch("getDepartmentById", context.state.department.id);
        });
    },
    deleteDepartment(context, id) {
      firebase
        .firestore()
        .collection("department")
        .doc(id)
        .delete()
        .then(() => {
          context.dispatch("snackbar", "삭제되었습니다.").then(
            setTimeout(() => {
              router.push({ path: "/Department" });
            }, 3000)
          );
        });
    }
  }
});
