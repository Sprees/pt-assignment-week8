class App {
    constructor() {
        this.tabManager = new TabManager({ 
            tabSelector: '[data-app-tab-for]', 
            paneSelector: '[data-app-tab-pane]', 
            defaultId: 'calendar',
        });
        this.scheduleManager = new ScheduleManager();
        this.calendar = new Calendar({ 
            body: '#calendar-body', 
            header: '#calendar-header', 
            date: new Date(),             
            onDayClick: this.handleDayClick.bind(this) 
        });

        this.init()
    }

    init() {
        this.calendar.render();
    }

    handleDayClick(selectedDate) {
        this.scheduleManager.setSelectedDate(selectedDate);
        console.log('Day Clicked')
        console.log(selectedDate)
        this.tabManager.switchToTab('scheduler');
    }
}

class TabManager {
    constructor({tabSelector, paneSelector, defaultId}) {
        console.log(typeof tabSelector)
        this.defaultId = defaultId
        this.tabs = document.querySelectorAll(tabSelector);
        this.panes = document.querySelectorAll(paneSelector);
        this.tabSelector = tabSelector.startsWith('[') && tabSelector.endsWith(']') ? tabSelector.slice(1, -1) : tabSelector

        if(!this.tabs.length || !this.panes.length) {
            throw new Error('TabManager: Invalid tab or pane selectors');
        }

        this.init();
        this.switchToTab(defaultId);
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabFor = tab.getAttribute(this.tabSelector);
                this.switchToTab(tabFor); 
            })
        })
    }

    switchToTab(tabId) {
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute(this.tabSelector) === tabId);
        });
        
        this.panes.forEach(pane => {
            pane.id !== tabId ? pane.style.display = 'none' : pane.style.display = 'block';
        });
    }
}

class ScheduleManager {
    constructor() {
        this.selectedDate = null;
    }

    setSelectedDate(date) {
        this.selectedDate = date;
        this.updateSchedulerUI();
    }

    updateSchedulerUI() {
        const schedulerDisplay = document.querySelector('#scheduler-date-display');

        if (schedulerDisplay && this.selectedDate) {
            schedulerDisplay.textContent = `${this.selectedDate.toLocaleDateString('en-us', {
                weekday: 'long',
                month: 'long',
                year: 'numeric',
                day: 'numeric'
            })}`;
        }
    }
}

class Calendar {
    constructor({date, body, header, onDayClick}) {
        if(!this.isValidDate(date)) {
            throw new Error('Invalid Date object')
        }

        this.header = document.querySelector(header);
        this.body = document.querySelector(body);

        this.today = date;
        this.month = date.getMonth();
        this.year = date.getFullYear();

        this.onDayClick = onDayClick

        this.createCalendarHeader();
    }

    isValidDate(date) {
        return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
    }

    isCurrentDate(day, month, year) {
        return day === this.today.getDate() && month === this.today.getMonth() && year === this.today.getFullYear();
    }

    getDaysInMonth(num = 0, month = this.month, year = this.year) {
        // 0 = last day of the previous month
        return new Date(year, month + num, 0).getDate()
    }

    getMonth(obj) {
        let { num = 0, month = this.month, year = this.year, today = false } = obj;

        if(today) {
            this.year = this.today.getFullYear();
            this.month = this.today.getMonth();
        } else {
            let date = new Date(year, month + num, 1);
            this.year = date.getFullYear();
            this.month = date.getMonth();
        }
        this.render();
    }

    createCalendarBody() {
        // Calendar body will have 6 rows of 7 - 42 elements
        let containerElCount = 0,
            // get the index of the first day of the month (0-6 / sun - sat) 
            firstDayOfMonth = new Date(this.year, this.month, 1).getDay(),
            // total amount of days in current month being displayed
            curMoTotalDays = this.getDaysInMonth(1), 
            // total amount of days in previous month
            prevMoTotalDays = this.getDaysInMonth(),
            // Find where to start previous month day count by subtracting first day index of current month from previous month total days
            prevMoDaysCount = (prevMoTotalDays - firstDayOfMonth) + 1,
            // start current and next month day count at 1
            curMoDaysCount = 1,
            nextMoDaysCount = 1;

        // Used while loop for readability with so many variables being affected in loop
        // containerElCount will be used to track the 42 elements being created
        while(containerElCount < 42) {
            let data;
            // create elements, the day div element and the day number that will be inside the day div
            let dayDiv = document.createElement('div');
            let dayNum = document.createElement('p');

            // add classes to each created element
            dayDiv.classList.add('day');
            dayNum.classList.add('day-number')
            
            // if the amount of elements created in less than the first day index of the month, fill those elements with previous months days
            if(containerElCount < firstDayOfMonth) {
                // add classes to distinguish previous day elements from current day or next day elements
                dayDiv.classList.add('day-prev')
                dayNum.classList.add('day-number-prev')
                // set the day number paragraph element to day count
                dayNum.innerHTML = '' + prevMoDaysCount;
                // add 1 to previous month days count
                data = new Date(this.year, this.month - 1, prevMoDaysCount);
                prevMoDaysCount++
            // otherwise, if current month day count is less than or equal to current month's total days, insert current month day number into day element
            } else if (curMoDaysCount <= curMoTotalDays) {
                if(this.isCurrentDate(curMoDaysCount, this.month, this.year)) {
                    dayDiv.classList.add('day-today')
                    dayNum.classList.add('day-number-today');
                }
                dayNum.classList.add('day-number-cur')
                dayNum.innerHTML = '' + curMoDaysCount;
                // add 1 to current month day count
                data = new Date(this.year, this.month, curMoDaysCount);
                curMoDaysCount++
            // if previous if/else conditions are not met, previous month and current month days have been applied to the day elements. Now start applying
            // next month day count to day element
            } else {
                dayDiv.classList.add('day-next')
                dayNum.classList.add('day-number-next')
                dayNum.innerHTML = '' + nextMoDaysCount;
                // add 1 to next day count
                data = new Date(this.year, this.month + 1, nextMoDaysCount);
                nextMoDaysCount++
            }
            
            dayDiv.addEventListener('click', () => {
                this.onDayClick(data);
            });
            // append the day number element to the day div
            dayDiv.appendChild(dayNum);
            // append day div to the calendar body
            this.body.appendChild(dayDiv);
            // add 1 to while loop condition count 
            containerElCount++
        }
    }

    createCalendarHeader() {
        // Create HTML elements
        const prevBtn = document.createElement('button'),
              nextBtn = document.createElement('button'),
              todayStringH1 = document.createElement('h1'),
              monthYearStringH1 = document.createElement('h1');

        // Add classes to the previous and next buttons
        prevBtn.classList.add('header-btn');
        nextBtn.classList.add('header-btn');

        // Insert text content into buttons
        prevBtn.textContent = 'Previous'
        nextBtn.textContent = 'Next'

        // Append the top-level H1 string that displays today's date to the header container as it's child
        this.header.appendChild(todayStringH1);

        // Create anonymous Div element for HTML structuring and CSS styling
        let div = document.createElement('div');

        // Append created Div to the headed container as a child, and append elements as siblings, to the Div as children
        this.header.appendChild(div).append(prevBtn, monthYearStringH1, nextBtn);

        this.todayTitleElement = todayStringH1;
        this.monthYearTitleElement = monthYearStringH1;

        // Event Listeners for Previous and Next buttons to change current month display
        prevBtn.addEventListener('click', () => this.getMonth({ num: -1 }));
        nextBtn.addEventListener('click', () => this.getMonth({ num: 1 }));
        // Event listener to today's date, when clicked returns to current month display
        todayStringH1.addEventListener('click', () => this.getMonth({ today: true }));

        this.updateCalendarHeader();
    }

    updateCalendarHeader() {
        // Today's date string
        let todayString = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleDateString('en-us', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })

        // Currently displayed month and year string
        let monthYearString = new Date(this.year, this.month, 1).toLocaleDateString('en-us', {
            month: 'long',
            year: 'numeric'
        })

        // Add a comma to month and year string
        monthYearString = monthYearString.split(' ').join(', ');

        // Insert created strings into the matching HTML Elements
        this.todayTitleElement.textContent = todayString;
        this.monthYearTitleElement.textContent = monthYearString;
    }

    render() {
        this.body.innerHTML = '';

        this.createCalendarBody();
        this.updateCalendarHeader();
    }
}

document.addEventListener('DOMContentLoaded', () => new App());