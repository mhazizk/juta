import {
  // add
  addDoc,
  setDoc,

  // get
  getDocs,
  getDoc,

  // update
  updateDoc,

  // delete
  deleteDoc,

  // query
  query,
  where,
  orderBy,

  // collection
  doc,
  collection,
} from "firebase/firestore/lite";
import { Alert } from "react-native";
import { db } from "../firebaseConfig";

// Get data from firestore
const getOneDoc = async (collectionName, documentId = null) => {
  try {
    const querySnapshot = await getDoc(doc(db, collectionName, documentId));
    return querySnapshot.data();
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

// Add data to firestore
const setData = async (collectionName, documentId = null, data) => {
  try {
    const docRef = await setDoc(doc(db, collectionName, documentId), data);
    // console.log("Document written w ith ID: ", docRef.id);
  } catch (error) {
    Alert.alert("Error", error.message);
    console.log(error.message);
  }
};

// Delete data from firestore
const deleteData = async (collectionName, documentId) => {
  try {
    const docRef = await deleteDoc(doc(db, collectionName, documentId));
    // console.log("Document written w ith ID: ", docRef.id);
  } catch (error) {
    Alert.alert("Error", error.message);
    console.log(error.message);
  }
};

const updateData = async (collectionName, documentId = null, data) => {
  try {
    const docRef = await updateDoc(doc(db, collectionName, documentId), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

const queryData = async (collectionName, uid) => {
  try {
    const q = query(collection(db, collectionName), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

const firestore = {
  getOneDoc,
  setData,
  deleteData,
  queryData,
};

export default firestore;
