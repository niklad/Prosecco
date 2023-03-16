function GetTomorrowsDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = tomorrow.getMonth() + 1 < 10 ? `0${tomorrow.getMonth() + 1}` : tomorrow.getMonth() + 1;
    const date = tomorrow.getDate() < 10 ? `0${tomorrow.getDate()}` : tomorrow.getDate();
    return `${year}-${month}-${date}`;
}

export default GetTomorrowsDate;
