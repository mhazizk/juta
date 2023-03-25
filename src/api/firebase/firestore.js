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
  startAt,
  startAfter,
  limit,

  // collection
  doc,
  collection,
  onSnapshot,
} from "firebase/firestore";
// import { onSnapshot, collection } from "firebase/firestore";
import { Alert, Settings } from "react-native";
import db from "./db";

// Get data from firestore
const getOneDoc = async (collectionName, documentId = null) => {
  try {
    const querySnapshot = await getDoc(doc(db, collectionName, documentId));
    return querySnapshot.data();
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });
  } catch (error) {
    // Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

// Listen to realtime one Doc
const setAndListenOneDoc = (
  collectionName,
  documentId = null,
  callback,
  errorCallback
) => {
  const query = doc(db, collectionName, documentId);

  return onSnapshot(
    query,
    (querySnapshot) => {
      callback(querySnapshot.data());
    },
    (error) => {
      // Alert.alert("Error", error.message);
      errorCallback(error);
    }
  );
};

// Listen to realtime one Doc
const getAndListenOneDoc = ({
  skipFirstRun = false,
  collectionName,
  documentId = null,
  callback,
  errorCallback,
}) => {
  let isFirstRun = skipFirstRun;
  const query = doc(db, collectionName, documentId);

  return onSnapshot(
    query,
    (querySnapshot) => {
      if (isFirstRun) {
        isFirstRun = false;
        return;
      } else {
        callback(querySnapshot.data());
      }
    },
    (error) => {
      switch (error.code) {
        case "permission-denied":
          break;
        case "insufficient-permissions":
          break;

        default:
          Alert.alert("Error", error.message);
          break;
      }
      errorCallback(error);
    }
  );
};

// Listen to realtime multiple docs
const getAndListenMultipleDocs = ({
  skipFirstRun = false,
  collectionName,
  documentId = null,
  errorCallback,
  getAllDocsCallback,
  getChangesDocsCallback,
}) => {
  let isFirstRun = skipFirstRun;
  const q = query(
    collection(db, collectionName),
    where("uid", "==", documentId)
  );

  return onSnapshot(
    q,
    (querySnapshots) => {
      getAllDocsCallback(querySnapshots.docs.map((doc) => doc.data()));

      let initialLength = 0;
      if (isFirstRun) {
        initialLength = querySnapshots.docChanges().length;
      }
      let counter = 0;
      const isBothEqualToZero = counter === 0 && initialLength === 0;
      querySnapshots.docChanges().forEach((change) => {
        console.log({ initialLength, counter, isFirstRun });
        switch (isFirstRun) {
          case true:
            switch (true) {
              case counter === initialLength - 1 && !isBothEqualToZero:
                counter++;
                isFirstRun = false;
                break;
              case counter < initialLength && !isBothEqualToZero:
                counter++;
                break;
            }
            break;
          case false:
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
            break;

          default:
            break;
        }
      });
    },
    (error) => {
      switch (error.code) {
        case "permission-denied":
          break;
        case "insufficient-permissions":
          break;

        default:
          Alert.alert("Error", error.message);
          break;
      }
      errorCallback(error);
    }
  );
};

// Add data to firestore
const setData = async (collectionName, documentId = null, data) => {
  if (!!collectionName && !!documentId && !!data) {
    try {
      setDoc(doc(db, collectionName, documentId), data).then((docRef) => {
        console.log("Document has beeen written");
      });
      // const docRef = await setDoc(doc(db, collectionName, documentId), data);
      // console.log("Document written with ID: ", docRef.id);
      // return docRef;
    } catch (error) {
      if (error.message.includes("Unsupported field value: undefined")) {
        console.log("Error", error.message);
      } else {
        Alert.alert("Error", error.message);
      }
      return Promise.reject(error);
    }
  }
};

// Delete data from firestore
const deleteData = async (collectionName, documentId) => {
  try {
    const docRef = await deleteDoc(doc(db, collectionName, documentId));
    // console.log("Document written w ith ID: ", docRef.id);
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

const updateData = async (collectionName, documentId = null, data) => {
  try {
    const docRef = await updateDoc(doc(db, collectionName, documentId), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

const queryData = async (collectionName, uid) => {
  try {
    const q = query(collection(db, collectionName), where("uid", "==", uid));
    // onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    //   snapshot.docChanges();
    // });
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

const getMyFeatureWishlist = async (collectionName, uid) => {
  try {
    const q = query(collection(db, collectionName), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

const paginationQuery = async (collectionName, wishlistId = null, limit) => {
  try {
    let q = query(
      collection(db, collectionName),
      orderBy("voters_count", "desc")
    );
    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot.docs);
    return querySnapshot.docs.map((doc) => doc.data());
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    Alert.alert("Error", error.message);
    return Promise.reject(error);
  }
};

const firestore = {
  getOneDoc,
  getAndListenMultipleDocs,
  getAndListenOneDoc,
  setData,
  deleteData,
  queryData,
  paginationQuery,
  getMyFeatureWishlist,
};

export default firestore;
