import moment from "moment"

export const GMT = -(new Date().getTimezoneOffset() / 60)
const DateFormatPattern = "DD/MM/YYYY HH:mm:ss"

export function FormatDate(Date, Format = DateFormatPattern) {
    let newDate = moment(Date).format(Format)
    return newDate
}

export function SubtractDate(StartDate, EndDate,Format = DateFormatPattern) {
    let newDate = moment(StartDate).diff(EndDate)
    return moment(newDate).format(Format)
}

export function GetDateGMT(Date, Format = DateFormatPattern) {
    let newDate = moment(Date).add(GMT,'hours').format(Format)
    return newDate
}
