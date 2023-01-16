export let pageMap = new Map();

export function getAllDates() {
    const dateList = [];
    for (let i = 0; i < 365; i++) {
        const date = new Date(2023, 0, i + 1);
        dateList.push(`${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}/${date.getFullYear()}`);
    }
    return dateList;
}

export function getDayOfWeek(dateString) {
    // Create a new date object from the input string
    var date = new Date(dateString);

    // Get the day of the week as a number (0 = Sunday, 1 = Monday, etc.)
    var dayOfWeek = date.getUTCDay();

    // Create an array of day names
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Return the name of the day of the week
    return daysOfWeek[dayOfWeek];
}

export function getFirstDatesOfWeeks() {
    var dates = [];
    var currentDate = new Date("01/01/2023");
    while (currentDate.getFullYear() === 2023) {
        var dayOfWeek = currentDate.getUTCDay();
        if (dayOfWeek === 0) { // Sunday
            var month = (currentDate.getUTCMonth() + 1).toString().padStart(2, "0");
            var day = currentDate.getUTCDate().toString().padStart(2, "0");
            var year = currentDate.getUTCFullYear();
            dates.push(`${month}/${day}/${year}`);
        }
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return dates;
}

export function getFirstDayOfWeek(inputDate) {
    var date = new Date(inputDate);
    var dayOfWeek = date.getUTCDay();
    if (dayOfWeek != 0) {
        var diff = date.getUTCDate() - dayOfWeek;
    } else diff = date.getUTCDate();
    var firstDayOfWeek = new Date(date.setUTCDate(diff));
    var month = (firstDayOfWeek.getUTCMonth() + 1).toString().padStart(2, "0");
    var day = firstDayOfWeek.getUTCDate().toString().padStart(2, "0");
    var year = firstDayOfWeek.getUTCFullYear();
    return `${month}/${day}/${year}`;
}

export function setPageMap(key, val) {
    pageMap.set(key, val);
}

function getPageId(key) {
    // console.log(pageMap);
    return pageMap.get(key);
}

export function getPageMap() {
    return pageMap;
}

// weeks are in form of {firstday} -> id
export function getWeekId(inputDate) {
    var firstDay = getFirstDayOfWeek(inputDate);
    console.log('get weekid ' + firstDay);
    return getPageId(firstDay);
}

function getMonthName(month) {
    let monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return "Month - " + monthNames[month];
}

// weeks are in form of Mont{month(0-11)} -> id
export function getMonthId(inputDate) {
    var date = new Date(inputDate);
    var month = date.getUTCMonth();
    console.log(month);
    var monthName = getMonthName(month);
    return getPageId(monthName);
}

// weeks are in form of {"Year"} -> id
export function getYearId() {
    return getPageId("Year");
}






