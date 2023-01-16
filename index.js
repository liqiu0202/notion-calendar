import { Client } from "@notionhq/client"
import { getFirstDatesOfWeeks, setPageMap, getAllDates, getWeekId, getMonthId, getYearId, getPageMap, getDayOfWeek} from './utils.js'

const notion = new Client({ auth: process.env.API_KEY })

const databaseId = process.env.HABIT_DB_ID;
const aggregationDBId = process.env.AGGREGATION_DB_ID;

async function addDay(dateStr) {
  var weekId = getWeekId(dateStr);
  var monthId = getMonthId(dateStr);
  var yearId = getYearId(dateStr);
  var date = new Date(dateStr);
  console.log("in addday: " + weekId + " " + monthId + " " + yearId);
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": getDayOfWeek(dateStr),
              }
            }
          ]
        },
        "To Aggregation": {
          "relation": [
            {
              "id": weekId
            },
            {
              "id": monthId
            },
            {
              "id": yearId
            }
          ],
            "has_more": true
        },
        "Date": {
          "date": {
            "start": date.toISOString(),
            "time_zone": "America/New_York"
          }
        }
      }
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}

async function addDays() {
  var days = getAllDates();
  for (const day of days) {
    console.log('add ' + day);
    await addDay(day);
  }
}


// type = [Week/Month/Year]
async function addAggregation(date, type) {
  date = new Date(date);
  try {
    const response = await notion.pages.create({
      parent: { database_id: aggregationDBId },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": type
              }
            }
          ]
        },
        "Date": {
          "date": {
            "start": date.toISOString(),
            "time_zone": "America/New_York"
          }
        }
      }
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}


async function loadDBSchema() {
  const response = await notion.databases.retrieve({ database_id: databaseId });
  console.log(response);
};

async function addWeeks() {
  var weeks = getFirstDatesOfWeeks();
  for (let i = 0; i < weeks.length; ++i) {
    var date = weeks[i];
    addAggregation(date, 'Week');
  }
}

function getDateString(dateString) {
  let parts = dateString.split('-');
  let mm = parts[1];
  let dd = parts[2];
  let yyyy = parts[0];
  return mm + "/" + dd + "/" + yyyy;
}

async function queryWeeks() {
  const response = await notion.databases.query({
    database_id: aggregationDBId,
    filter: {
      "property": "Name",
      "rich_text": {
          "contains": "Week"
      }
    }
  });
  // console.log(response);
  for (const page of response.results) {
    // get string in mm/dd/yyyy
    var key = getDateString(page.properties.Date.date.start.substring(0, 10));
    var val = page.id;
    // console.log(key);
    setPageMap(key, val);
    // pageMap.set(key, val);
  }
  // console.log(pageMap);
};

async function queryMonths() {
  const response = await notion.databases.query({
    database_id: aggregationDBId,
    filter: {
      "property": "Name",
      "rich_text": {
          "contains": "Month"
      }
    }
  });
  for (const page of response.results) {
    var key = page.properties.Name.title[0].plain_text;
    var val = page.id;
    setPageMap(key, val);
  }
  // console.log(getPageMap());
};

async function queryYear() {
  const response = await notion.databases.query({
    database_id: aggregationDBId,
    filter: {
      "property": "Name",
      "rich_text": {
          "contains": "Year"
      }
    }
  });
  for (const page of response.results) {
    var key = page.properties.Name.title[0].plain_text;
    var val = page.id;
    setPageMap(key, val);
  }
  // console.log(getPageMap());
};


await queryMonths();
await queryWeeks();
await queryYear();
// console.log(getPageMap());
addDays();