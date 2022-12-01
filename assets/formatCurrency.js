// ! Format Currency
const formatCurrency = ({ amount, locale }) => {
    // let checkAmount = String(amount).replace(/[^a-zA-Z0-9 ]/g, '');
    // let checkAmount = String(amount).replace(/[^, ]/g, '');
    let length = String(amount).length
    let getLeft = String(amount).slice(0, length - 1)
    // console.log({ length })
    // console.log({ getLeft })
    // console.log(checkAmount)
    // console.log(typeof (checkAmount))
    let showFormattedAmount;

    switch (true) {
        case locale === 'IDR':
            // showFormattedAmount = parseFloat(amount);
            // console.log({amount})
            showFormattedAmount = Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            // console.log(showFormattedAmount)
            break;
        case locale === 'USD':
            showFormattedAmount = Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
            break;

        default:
            break;
    }
    return showFormattedAmount

}

export const locale = ['IDR', 'USD']

export default formatCurrency;