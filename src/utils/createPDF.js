import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import FindById from "./FindById";
import getFormattedNumber from "./getFormattedNumber";

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
  negativeCurrencySymbol,
  finalBalance,
}) => {
  return `
        <!DOCTYPE html>
        <html>
            <head>
            <meta charset="utf-8">
            <title>Juta Account Statement</title>
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
                  finalBalance,
                })}
                ${table({
                  openingBalance,
                  displayName,
                  categories,
                  logbook,
                  transactionData,
                  negativeCurrencySymbol,
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
  finalBalance,
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
        <!-- // TODO : commented out for now
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
        </tr> -->
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
        <tr>
            <td
            style="font-weight:bold"
            >
                Final Balance
            </td>
            <td>
                :
            </td>
            <td>
                ${finalBalance}
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
  negativeCurrencySymbol,
}) => {
  return `
        <table
        style="width:100vw;
        border:2px solid;
        border-collapse:collapse;
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
              negativeCurrencySymbol,
            })}
            ${tableSummary({
              logbook,
              transactionData,
              negativeCurrencySymbol,
            })}
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

const trColor = (index) => {
  const backgroundColor = index % 2 ? "white" : "#E5E5E5";
  return `
                  <tr
                  style="
                  background-color:${backgroundColor};
                  ">
                    `;
};

// TAG : Map table data
/**
 * Function to map transaction data into table
 *
 * Each row consists of 3 smaller rows
 *
 * 1. First row mainly consist of transaction date, name, and balance
 * 2. Second row consist of transaction category
 * 3. Third row consist of transaction notes
 *
 *    | No | Date | Details | Cash In | Cash Out | Balance |
 *
 * @param
 * @returns
 */
const mapData = ({
  openingBalance,
  displayName,
  categories,
  logbook,
  transactionData,
  negativeCurrencySymbol,
}) => {
  const transactionNotes = (index, notes) => {
    return `
          <tr>
            ${tdNoBorder}
            </td>
            ${tdNoBorder}
            </td>
            ${td}
               Notes : ${!!notes ? notes : "-"}
            </td>
            ${tdNoBorder}
            </td>
            ${tdNoBorder}
            </td>
            ${tdNoBorder}
            </td>
        </tr>
            `;
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
            <tr>
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
                   Name : ${displayName}
                </td>
                ${tdAlignRight}
                    ${
                      transaction.details.in_out === "income"
                        ? getFormattedNumber({
                            value: transaction.details.amount,
                            currencyIsoCode: logbook.logbook_currency.isoCode,
                            negativeSymbol: negativeCurrencySymbol,
                          })
                        : "-"
                    }
                </td>
                ${tdAlignRight}
                    ${
                      transaction.details.in_out === "expense"
                        ? getFormattedNumber({
                            value: transaction.details.amount,
                            currencyIsoCode: logbook.logbook_currency.isoCode,
                            negativeSymbol: negativeCurrencySymbol,
                          })
                        : "-"
                    }
                </td>
                ${tdAlignRight}
                ${getFormattedNumber({
                  value: balance,
                  currencyIsoCode: logbook.logbook_currency.isoCode,
                  negativeSymbol: negativeCurrencySymbol,
                })}
                </td>
            </tr>
        
        
            <!-- Second Row -->
            <tr>
                ${tdNoBorder}
                </td>
                ${tdNoBorder}
                </td>
                ${tdCategory}
                   Category : ${FindById.findCategoryNameById({
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
const tableSummary = ({ logbook, transactionData, negativeCurrencySymbol }) => {
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
          currencyIsoCode: logbook.logbook_currency.isoCode,
          negativeSymbol: negativeCurrencySymbol,
        })}
        </td>
        ${tdAlignRight}
            ${getFormattedNumber({
              value: allExpense.reduce((a, b) => a + b, 0),
              currencyIsoCode: logbook.logbook_currency.isoCode,
              negativeSymbol: negativeCurrencySymbol,
            })}
        </td>
        ${tdAlignRight}
            ${getFormattedNumber({
              value:
                allIncome.reduce((a, b) => a + b, 0) -
                allExpense.reduce((a, b) => a + b, 0),
              currencyIsoCode: logbook.logbook_currency.isoCode,
              negativeSymbol: negativeCurrencySymbol,
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
        --- End of Report ---
        <br />
        <br />
        Generated by
        <a href="https://www.juta-web.vercel.app">Juta Expense Tracker</a>
        <br />
        &copy Juta ${new Date().getFullYear()}
        </div>
        
        
        `;

const createPDF = async ({
  displayName,
  uid,
  startDate,
  finishDate,
  logbook,
  categories,
  openingBalance,
  finalBalance,
  transactionData,
  fileName,
  appSettings,
}) => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  const { negativeCurrencySymbol } = appSettings.logbookSettings;
  const options = {
    html: html({
      displayName,
      uid,
      startDate,
      finishDate,
      logbook,
      categories,
      openingBalance,
      finalBalance,
      transactionData,
      negativeCurrencySymbol,
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
