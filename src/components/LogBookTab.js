// import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { useEffect, useState } from "react";
// import icons from "react-native-vector-icons/Ionicons";
// import userLogBooks from "../database/userLogBooks";
// import NewLogBookScreen from "../screens/logbook/NewLogBookScreen";

// const Tab = createMaterialTopTabNavigator();

// const LogBookTab = () => {
//   const [logbooks, setLogbooks] = useState();

//   useEffect(() => {
//     setLogbooks(userLogBooks);
//     console.log(logbooks);
//   }, []);

//   const logBooks = {
//     logBook1: "logBook1",
//     logBook2: "logBook2",
//     newLogBookScreen: "New Log Book Screen",
//   };

//   const RenderTab = () => {
//     for (let i = 0; i < logbooks.length; i++) {
//       return (
//         <>
//           <Tab.Screen name={"logbook" + i} component={LogBookScreen} />
//         </>
//       );
//     }
//   };

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarIndicatorStyle: { backgroundColor: "#000" },
//       }}
//     >
//       {/* <RenderTab /> */}
//       <Tab.Screen
//         options={{ title: "Add" }}
//         name={logBooks.newLogBookScreen}
//         component={NewLogBookScreen}
//       />
//     </Tab.Navigator>
//   );
// };

// export default LogBookTab;
