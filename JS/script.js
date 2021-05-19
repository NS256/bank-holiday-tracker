async function getBankHolidaysJSON() {
    var response = await fetch('https://www.gov.uk/bank-holidays.json');
    var json = await response.json();
    return json;
}

function fillDropDownList(object){
    const dropDown = document.querySelector('#select-region');
    const yearSelect = document.querySelector('#select-year');
    const keys = Object.keys(object);
    var options = [];
    var years = [];
    for(let key of keys){
            //Split each key from object to build dropdown option labels
        splitKey = key.split('-');
        var output = '';
            //Add upper case letter to any words that aren't 'and'
        for(let i = 0; i < splitKey.length; i++){
            if(splitKey[i] != 'and' ){
                splitKey[i] = splitKey[i].charAt(0).toUpperCase() + splitKey[i].slice(1);
            }
            if(output.length == 0){
                output += splitKey[i];
            } else {
                output += ` ${splitKey[i]}`
            }            
        }
            //push label and value of option into the options array
        options.push({
            label: output,
            value: key
        });
    }
        //Fill select-region dropdown list with label and value of all regions from options array
    for(let i = 0; i < options.length; i++){
        var option = document.createElement('option');
        option.setAttribute('value',options[i].value);
        option.innerHTML = options[i].label;
        dropDown.appendChild(option);
    }

        //Get years to populate years dropdown
    for (let event of object[keys[0]].events){
        if (!years.includes(event.date.substring(0,4))){
            var today = new Date();
            var date = event.date.substring(0,4)
            //add year to years array
            years.push(date);
            //add year to year selection table
            var year = document.createElement('td');
            year.setAttribute('value',date);
            year.setAttribute('class','available-year');
            //set current year as the targetted year
                if(date == today.getFullYear()){
                    year.setAttribute('id','selected-year');
                }
            year.innerHTML = date;
            yearSelect.appendChild(year);
        }
    }
        //update colspan of select region box
        dropDown.parentNode.setAttribute('colspan',(document.querySelector('#dropdown-container table').rows[1].cells.length - 1));

        setEventListeners();
        sortHolidays(object, years);
        displayHolidays();
}

function setEventListeners() {
    document.querySelector('#select-region').addEventListener('change',displayHolidays, true);
    var dateButtons = document.querySelectorAll('.available-year');
    console.log(dateButtons)
    for (let button of dateButtons){
        button.addEventListener('click',event => changeSelectedYear(event),true);
    }}

function sortHolidays(holidayObject, yearsArray) {
    var holidayObjectKeys = Object.keys(holidayObject);

    //get keys of array
    for (let key of holidayObjectKeys){
        sortedHolidayArray[key] = {}
        //var holidayArray = { `${key}`: {}};
        for (let year of yearsArray){
            //holidayArray.key[year] = {};
            sortedHolidayArray[key][year] = []
        }
        
        for(i = 0; i < holidayObject[key].events.length; i++){
            sortedHolidayArray[key][holidayObject[key].events[i].date.substring(0,4)].push(holidayObject[key].events[i]);
        }
    }


}

function displayHolidays() {
    clearHolidays()

    const region = document.querySelector('#select-region').value;
    const year = document.querySelector('#selected-year').innerHTML;

    for (i=0; i< sortedHolidayArray[region][year].length; i++){
        createHoliday(sortedHolidayArray[region][year][i].title,
            sortedHolidayArray[region][year][i].date,
            sortedHolidayArray[region][year][i].bunting,
            sortedHolidayArray[region][year][i].notes);
    }
}

function clearHolidays(){
    const container = document.querySelector('#bank-holidays-container');
    container.innerHTML = "";
}

function createHoliday(name, date, bunting = false, notes = "") {
    const bankHolidaysContainer = document.querySelector('#bank-holidays-container');

    var div = document.createElement('div');
    div.setAttribute('class','bank-holiday');
    div.setAttribute('id',`${date}`);

    var table = document.createElement('table');

    var headerRow = document.createElement('tr');
    var headerData = document.createElement('td');
    var headerStrong = document.createElement('h2');
    headerData.setAttribute('colspan','2');
    headerStrong.innerHTML = name;
    headerData.appendChild(headerStrong);
    headerRow.appendChild(headerData);
    table.appendChild(headerRow);

    var dateRow = document.createElement('tr');
    var dateData = document.createElement('td');
    dateData.setAttribute('colspan','2');
    dateData.innerHTML = date;
    dateRow.appendChild(dateData);
    table.appendChild(dateRow);

    var buntingRow = document.createElement('tr');
    var buntingDataTitle = document.createElement('td');
    var buntingDataValue = document.createElement('td');

    buntingDataTitle.innerHTML = 'Bunting Required?';
    buntingDataValue.innerHTML = bunting;
    buntingRow.appendChild(buntingDataTitle);
    buntingRow.appendChild(buntingDataValue);
    table.appendChild(buntingRow);

    var notesHeaderRow = document.createElement('tr');
    var notesHeaderData = document.createElement('td');
    notesHeaderData.setAttribute('colspan','2');
    notesHeaderData.innerHTML = `Notes:<br>${notes}`
    notesHeaderRow.appendChild(notesHeaderData);
    table.appendChild(notesHeaderRow);
    
    div.appendChild(table);
    bankHolidaysContainer.appendChild(div);
}

function changeSelectedYear(e) {
    const YEARS = document.querySelectorAll('.available-year');
    for(let year of YEARS){
        year.setAttribute('id','')
    }
    e.currentTarget.setAttribute('id','selected-year');
    displayHolidays()
}

var sortedHolidayArray = {};

getBankHolidaysJSON().then(json => fillDropDownList(json));

