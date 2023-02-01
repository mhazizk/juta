// import {
//   // add
//   addDoc,
//   setDoc,

//   // get
//   getDocs,
//   getDoc,

//   // update
//   updateDoc,

//   // delete
//   deleteDoc,

//   // query
//   query,
//   where,
//   orderBy,
//   startAt,
//   startAfter,
//   limit,

//   // collection
//   doc,
//   collection,
//   onSnapshot,
// } from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";

// import { onSnapshot, collection } from "firebase/firestore";
import { Alert, Settings } from "react-native";
// import db from "./db";
// Get data from firestore
const getOneDoc = async (collectionName, documentId = null) => {
  try {
    const querySnapshot = await firestore()
      .collection(collectionName)
      .doc(documentId)
      .get();
    // const querySnapshot = await getDoc(doc(db, collectionName, documentId));
    return querySnapshot.data();
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

// Listen to realtime one Doc
// const setAndListenOneDoc = (
//   collectionName,
//   documentId = null,
//   callback,
//   errorCallback
// ) => {
//   const query = doc(db, collectionName, documentId);

//   return onSnapshot(
//     query,
//     (querySnapshot) => {
//       callback(querySnapshot.data());
//     },
//     (error) => {
//       Alert.alert("Error", error.message);
//       errorCallback(error);
//     }
//   );
// };

// Listen to realtime one Doc
const getAndListenOneDoc = (
  collectionName,
  documentId = null,
  callback,
  errorCallback
) => {
  // const query = firestore().collection(collectionName).doc(documentId).get();
  // const query = doc(db, collectionName, documentId);
  return firestore()
    .collection(collectionName)
    .doc(documentId)
    .onSnapshot(
      (documentSnapshot) => {
        callback(documentSnapshot.data());
      },
      (error) => {
        Alert.alert("Error", error.message);
        errorCallback(error);
      }
    );
  // return onSnapshot(
  //   query,
  //   (querySnapshot) => {
  //     callback(querySnapshot.data());
  //   },
  //   (error) => {
  //     Alert.alert("Error", error.message);
  //     errorCallback(error);
  //   }
  // );
};

// Listen to realtime multiple docs
const getAndListenMultipleDocs = (
  collectionName,
  documentId = null,
  errorCallback,
  getAllDocsCallback,
  getChangesDocsCallback
) => {
  // const q = query(
  //   collection(db, collectionName),
  //   where("uid", "==", documentId)
  // );

  return firestore()
    .collection(collectionName)
    .where("uid", "==", documentId)
    .get()
    .then(
      (querySnapshots) => {
        getAllDocsCallback(querySnapshots.docs.map((doc) => doc.data()));
        querySnapshots.docChanges().forEach((change) => {
          switch (change.type) {
            case "added":
              getChangesDocsCallback(change.doc.data(), "added");
              break;
            case "modified":
              getChangesDocsCallback(change.doc.data(), "modified");
              break;
            case "removed":
              getChangesDocsCallback(change.doc.data(), "removed");
              break;

            default:
              break;
          }
        });
      },
      (error) => {
        Alert.alert("Error", error.message);
        errorCallback(error);
      }
    );

  // return onSnapshot(
  //   q,
  //   (querySnapshots) => {
  //     getAllDocsCallback(querySnapshots.docs.map((doc) => doc.data()));

  //     querySnapshots.docChanges().forEach((change) => {
  //       switch (change.type) {
  //         case "added":
  //           getChangesDocsCallback(change.doc.data(), "added");
  //           break;
  //         case "modified":
  //           getChangesDocsCallback(change.doc.data(), "modified");
  //           break;
  //         case "removed":
  //           getChangesDocsCallback(change.doc.data(), "removed");
  //           break;

  //         default:
  //           break;
  //       }
  //     });
  //   },
  //   (error) => {
  //     Alert.alert("Error", error.message);
  //     errorCallback(error);
  //   }
  // );
};

// Add data to firestore
const setData = async (collectionName, documentId = null, data) => {
  try {
    return firestore()
      .collection(collectionName)
      .doc(documentId)
      .set(data)
      .then((docRef) => {
        alert("Document has beeen written");
      });
    // setDoc(doc(db, collectionName, documentId), data).then((docRef) => {
    //   alert("Document has beeen written");
    // });
    // const docRef = await setDoc(doc(db, collectionName, documentId), data);
    // console.log("Document written with ID: ", docRef.id);
    // return docRef;
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

// Delete data from firestore
const deleteData = async (collectionName, documentId) => {
  try {
    return firestore().collection(collectionName).doc(documentId).delete();
    // const docRef = await deleteDoc(doc(db, collectionName, documentId));
    // console.log("Document written w ith ID: ", docRef.id);
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

// const updateData = async (collectionName, documentId = null, data) => {
//   try {
//     const docRef = await updateDoc(doc(db, collectionName, documentId), data);
//     console.log("Document written with ID: ", docRef.id);
//   } catch (error) {
//     Alert.alert("Error", error.message);
//     return Promise.reject(error);
//   }
// };

const queryData = async (collectionName, uid) => {
  try {
    // const q = query(collection(db, collectionName), where("uid", "==", uid));
    // onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    //   snapshot.docChanges();
    // });
    return firestore()
      .collection(collectionName)
      .where("uid", "==", uid)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data());
      });
    // const querySnapshot = await getDocs(q);
    // return querySnapshot.docs.map((doc) => doc.data());
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

const getMyFeatureWishlist = async (collectionName, uid) => {
  try {
    return firestore()
      .collection(collectionName)
      .where("uid", "==", uid)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data());
      });

    // const q = query(collection(db, collectionName), where("uid", "==", uid));
    // const querySnapshot = await getDocs(q);
    // return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

const paginationQuery = async (collectionName, wishlistId = null, limit) => {
  try {
    return firestore()
      .collection(collectionName)
      .orderBy("voters_count", "desc")
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data());
      });

    // let q = query(
    //   collection(db, collectionName),
    //   orderBy("voters_count", "desc")
    // );
    // const querySnapshot = await getDocs(q);
    // // console.log(querySnapshot.docs);
    // return querySnapshot.docs.map((doc) => doc.data());
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

// const firestore = {
//   getOneDoc,
//   getAndListenMultipleDocs,
//   getAndListenOneDoc,
//   setData,
//   deleteData,
//   queryData,
//   paginationQuery,
//   getMyFeatureWishlist,
// };

export default {
  getOneDoc,
  getAndListenMultipleDocs,
  getAndListenOneDoc,
  setData,
  deleteData,
  queryData,
  paginationQuery,
  getMyFeatureWishlist,
};
