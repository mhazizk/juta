const passwordCheck = ({
  email,
  password,
  conditionsList,
  onAnyUnfulfilledCallback,
  onAllFulfilledCallback,
}) => {
  switch (true) {
    case !password:
      onAnyUnfulfilledCallback(conditionsList);
      break;
    case !!email && !!password:
      let id1Checked = conditionsList.find((item) => item.id === 1).checked;
      let id2Checked = conditionsList.find((item) => item.id === 2).checked;
      let id3Checked = conditionsList.find((item) => item.id === 3).checked;
      let id4Checked = conditionsList.find((item) => item.id === 4).checked;
      let id5Checked = conditionsList.find((item) => item.id === 5).checked;
      const temp = [];
      const newList = [];
      for (const condition of conditionsList) {
        switch (true) {
          case !temp.length:
            if (password.length >= 6) {
              id1Checked = true;
            } else {
              id1Checked = false;
            }
            newList.push(id1Checked);
            temp.push(1);
            break;
          case temp.length === 1:
            if (/\d/.test(password)) {
              id2Checked = true;
            } else {
              id2Checked = false;
            }
            newList.push(id2Checked);
            temp.push(2);
            break;
          case temp.length === 2:
            if (/[-!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g.test(password)) {
              id3Checked = true;
            } else {
              id3Checked = false;
            }
            newList.push(id3Checked);
            temp.push(3);
            break;
          case temp.length === 3:
            if (password.includes(email.toLowerCase())) {
              id4Checked = false;
            } else {
              id4Checked = true;
            }
            newList.push(id4Checked);
            temp.push(4);
            break;

          case temp.length === 4:
            if (
              password.includes(123456) ||
              password.includes(12345678) ||
              password.includes("qwerty") ||
              password.includes("asdfgh") ||
              password.includes("password")
            ) {
              id5Checked = false;
            } else {
              id5Checked = true;
            }
            newList.push(id5Checked);
            temp.push(5);
            break;

          default:
            break;
        }
      }
      const newConditionsList = conditionsList.map((item, index) => {
        return {
          ...item,
          checked: newList[index],
        };
      });

      // check if there is any false in the newConditionsList
      const isAnyFalseConditions = newList.some(
        (condition) => condition === false
      );
      console.log({ newList });
      if (isAnyFalseConditions) {
        console.log("isAnyFalseConditions", isAnyFalseConditions);
        onAnyUnfulfilledCallback(newConditionsList);
      } else {
        console.log("isAnyFalseConditions", isAnyFalseConditions);
        onAllFulfilledCallback(newConditionsList);
      }
  }
};

export default passwordCheck;
