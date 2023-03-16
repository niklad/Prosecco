function GetTodaysDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const monthString = month < 10 ? `0${month}` : month;
    const dateString = date < 10 ? `0${date}` : date;
    return `${year}-${monthString}-${dateString}`;
}

export default GetTodaysDate;