/* Function to format hyphen in strings
 * Example: "en-us" => "En - Us"
 */
const formatHyphenInStrings = (str) => {
  const firstWordWithHyphen = str.replace(/[^-]*$/, "");
  const firstWord = firstWordWithHyphen.replace(/-/, "");
  const lastWord = str.replace(/^[^-]*-+/, "");

  return `${firstWord[0].toUpperCase() + firstWord.substring(1)} - ${
    lastWord[0].toUpperCase() + lastWord.substring(1)
  }`;
};

export default formatHyphenInStrings;
