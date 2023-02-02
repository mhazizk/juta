import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import FindById from "./FindById";
import getFormattedNumber from "./FormatNumber";

const td = `
        <td
        style="
        padding:4px;
        border:0.3px solid;
        white-space:nowrap;
        // border-color:red;
        ">
        `;

const tdCategory = `
        <td
        style="
        padding:4px;
        width:100%;
        border:0.3px solid;
        // border-color:red;
        ">
        `;

const tdAlignRight = `
        <td
        style="
        padding:4px;
        border-top:0.3px solid;
        border-left:0.3px solid;
        // border-color:red;
        text-align:right;
        ">
        `;

const tdBorderTopNumber = `
        <td
        style="
        padding:4px;
        border-top:0.3px solid;
        border-left:0.3px solid;
        text-align:center;
        ">
        `;
const tdBorderTop = `
        <td
        style="
        padding:4px;
        border-top:0.3px solid;
        border-left:0.3px solid;
        white-space:nowrap;
        // border-color:red;
        ">
        `;
const tdNoBorder = `
        <td
        style="
        padding:4px;
        border-left:0.3px solid;
        // border-color:red;
        ">
        `;

const trBody = `
        <tr
        style="
        // background-color:#D5D5D5;
        ">
        `;

// TAG : HTML
const html = ({
  displayName,
  uid,
  startDate,
  finishDate,
  logbook,
  categories,
  openingBalance,
  transactionData,
}) => {
  return `
        <!DOCTYPE html>
        <html>
            <head>
            <meta charset="utf-8">
            <title>CashLog Account Statement</title>
            <style>
            body {
                font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
                color: #000;
                font-size: 12px;
            }
            </style>
            </head>
            <body>
                ${pdfHeader({
                  displayName,
                  uid,
                  startDate,
                  finishDate,
                  logbook,
                  openingBalance,
                })}
                ${table({
                  openingBalance,
                  displayName,
                  categories,
                  logbook,
                  transactionData,
                })}
                ${pdfFooter}
            </body>
        </html>
        `;
};

// TAG : PDF Header
const pdfHeader = ({
  displayName,
  uid,
  startDate,
  finishDate,
  logbook,
  openingBalance,
}) => {
  return `
        <div
        style="text-align:center"
        >
        <h1>Account Statement</h1>
        </div>

        <table>
        <tr>
            <td
            style="font-weight:bold"
            >
                Account Name
            </td>
            <td>
                :
            </td>
            <td>
                ${displayName}
            </td>
        </tr>
        <tr>
            <td
                style="font-weight:bold"
            >
                Account ID
            </td>
            <td>
                :
            </td>
            <td>
                ${uid}
            </td>
        </tr>
        <tr>
            <td
            style="font-weight:bold"
            >
                Period
            </td>
            <td>
                :
            </td>
            <td>
                ${new Date(startDate).toDateString()} - ${new Date(
    finishDate
  ).toDateString()}
            </td>
        </tr>
        <tr>
            <td
            style="font-weight:bold"
            >
                Logbook
            </td>
            <td>
                :
            </td>
            <td>
                ${logbook.logbook_name}
            </td>
        </tr>
        <tr>
            <td
            style="font-weight:bold"
            >
                Currency
            </td>
            <td>
                :
            </td>
            <td>
                ${logbook.logbook_currency.name}
            </td>
        </tr>
        <tr>
            <td
            style="font-weight:bold"
            >
                Opening Balance
            </td>
            <td>
                :
            </td>
            <td>
                ${openingBalance}
            </td>
        </tr>
        </table>
        `;
};

// TAG : Full Table
const table = ({
  displayName,
  openingBalance,
  categories,
  logbook,
  transactionData,
}) => {
  return `
        <table
        style="width:100vw;
        border:2px solid;
        border-collapse:collapse
        "
        >

        <!-- Table -->
            ${tableHeader}
            ${mapData({
              openingBalance,
              displayName,
              categories,
              logbook,
              transactionData,
            })}
            ${tableSummary({ logbook, transactionData })}
        </table>`;
};

// TAG : Table Header
const tableHeader = `
        <tr
        style="
        text-align:center;
        background-color:orange;
        border:2px solid
        "
        >
        ${td}
            No
        </td>
        ${td}
            Date
        </td>
        ${td}
            Details
        </td>
        ${td}
            Cash In
        </td>
        ${td}
            Cash Out
        </td>
        ${td}
            Balance
        </td>
        </tr>`;

// TAG : Map table data
const mapData = ({
  openingBalance,
  displayName,
  categories,
  logbook,
  transactionData,
}) => {
  const trColor = (index) => {
    const backgroundColor = index % 2 ? "white" : "#E5E5E5";
    return `
            <tr
            style="
            background-color:${backgroundColor};
            ">
              `;
  };
  const transactionNotes = (index, notes) => {
    return (
      notes &&
      `
        ${trColor(index)}
            ${tdNoBorder}
            </td>
            ${tdNoBorder}
            </td>
            ${td}
                ${notes}
            </td>
            ${tdNoBorder}
            </td>
            ${tdNoBorder}
            </td>
            ${tdNoBorder}
            </td>
        </tr>
            `
    );
  };
  let balance = openingBalance;
  return transactionData.map((transaction) => {
    const index = transactionData.indexOf(transaction) + 1;
    if (transaction.details.in_out === "expense") {
      balance = balance - transaction.details.amount;
    } else {
      balance = balance + transaction.details.amount;
    }
    return `
            <!-- First Row -->
            ${trColor(index)}
                ${tdBorderTopNumber}
                    ${index}
                </td>
                ${tdBorderTop}
                    ${`${new Date(transaction.details.date).toDateString()} ,
                      ${
                        new Date(transaction.details.date)
                          .getHours()
                          .toString()
                          .padStart(2, "0") +
                        ":" +
                        new Date(transaction.details.date)
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")
                      }
                    `}
                </td>
                ${td}
                    ${displayName}
                </td>
                ${tdAlignRight}
                    ${
                      transaction.details.in_out === "income"
                        ? getFormattedNumber({
                            value: transaction.details.amount,
                            currency: logbook.logbook_currency.name,
                          })
                        : "-"
                    }
                </td>
                ${tdAlignRight}
                    ${
                      transaction.details.in_out === "expense"
                        ? getFormattedNumber({
                            value: transaction.details.amount,
                            currency: logbook.logbook_currency.name,
                          })
                        : "-"
                    }
                </td>
                ${tdAlignRight}
                ${getFormattedNumber({
                  value: balance,
                  currency: logbook.logbook_currency.name,
                })}
                </td>
            </tr>
        
        
            <!-- Second Row -->
            ${trColor(index)}
                ${tdNoBorder}
                </td>
                ${tdNoBorder}
                </td>
                ${tdCategory}
                    ${FindById.findCategoryNameById({
                      id: transaction.details.category_id,
                      categories: categories,
                    })}
                </td>
                ${tdNoBorder}
                </td>
                ${tdNoBorder}
                </td>
                ${tdNoBorder}
                </td>
            </tr>
        
            <!-- Third Row -->
            ${transactionNotes(index, transaction.details.notes)}
            `;
  });
};

// TAG : Table Summary Footer
const tableSummary = ({ logbook, transactionData }) => {
  const allExpense = [];
  const allIncome = [];
  transactionData.forEach((transaction) => {
    if (transaction.details.in_out === "expense") {
      allExpense.push(transaction.details.amount);
    } else {
      allIncome.push(transaction.details.amount);
    }
  });
  return `
        <tr
        style="
        text-align:center;
        background-color:orange;
        border:2px solid
        "
        >
        ${td}
        </td>
        ${td}
            Total
        </td>
        ${td}
        </td>
        ${tdAlignRight}
        ${getFormattedNumber({
          value: allIncome.reduce((a, b) => a + b, 0),
          currency: logbook.logbook_currency.name,
        })}
        </td>
        ${tdAlignRight}
            ${getFormattedNumber({
              value: allExpense.reduce((a, b) => a + b, 0),
              currency: logbook.logbook_currency.name,
            })}
        </td>
        ${tdAlignRight}
            ${getFormattedNumber({
              value:
                allIncome.reduce((a, b) => a + b, 0) -
                allExpense.reduce((a, b) => a + b, 0),
              currency: logbook.logbook_currency.name,
            })}
        </td>
        </tr>`;
};

// TAG : PDF Footer
const pdfFooter = `
        <div
        style="
        padding:16px;
        text-align:center"
        >
        Copyright Cashlog 2023
        </div>`;

const createPDF = async ({
  displayName,
  uid,
  startDate,
  finishDate,
  logbook,
  categories,
  openingBalance,
  transactionData,
  fileName,
}) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  const options = {
    html: html({
      displayName,
      uid,
      startDate,
      finishDate,
      logbook,
      categories,
      openingBalance,
      transactionData,
    }),
    fileName: fileName,
    base64: false,
  };

  const cacheFile = await Print.printToFileAsync(options);
  const moveFile = await FileSystem.moveAsync({
    from: cacheFile.uri,
    to: fileUri,
  });
  return Promise.all([moveFile])
    .then(() => {
      return Promise.resolve(fileUri);
    })
    .catch((e) => {
      return Promise.reject(e);
    });

  //   return await FileSystem.writeAsStringAsync(fileUri, data);
};
export default createPDF;
