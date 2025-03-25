class App {
    constructor() {
        this.employees = [
            {
                firstName: "Logan",
                lastName: "Baird",
                phone: "(544) 842-7066",
                position: "Lead",
                id: 1

            },
            {
                firstName: "Blake",
                lastName: "Witt",
                phone: "(759) 462-3491",
                position: "Laborer",
                id: 2
            },
            {
                firstName: "Christian",
                lastName: "Clarke",
                phone: "(572) 623-3038",
                position: "Lead",
                id: 3
            },
            {
                firstName: "Reuben",
                lastName: "Hardin",
                phone: "(847) 723-6068",
                position: "Lead",
                id: 4
            },
            {
                firstName: "Tiger",
                lastName: "Burgess",
                phone: "(317) 544-5435",
                position: "Lead",
                id: 5
            },
            {
                firstName: "Conan",
                lastName: "Dejesus",
                phone: "(512) 716-4738",
                position: "Lead",
                id: 6
            },
            {
                firstName: "Herman",
                lastName: "Morrison",
                phone: "(905) 437-2547",
                position: "Laborer",
                id: 7
            },
            {
                firstName: "Stephen",
                lastName: "Baker",
                phone: "(627) 418-6178",
                position: "Laborer",
                id: 8
            },
            {
                firstName: "Basil",
                lastName: "Salazar",
                phone: "(745) 683-2197",
                position: "Laborer",
                id: 9
            },
            {
                firstName: "Levi",
                lastName: "Shaffer",
                phone: "(243) 773-8634",
                position: "Laborer",
                id: 10
            },
            {
                firstName: "Slade",
                lastName: "Conley",
                phone: "(431) 440-6155",
                position: "Laborer",
                id: 11
            },
            {
                firstName: "Clinton",
                lastName: "Berg",
                phone: "(310) 378-2405",
                position: "Laborer",
                id: 12
            },
            {
                firstName: "Jarrod",
                lastName: "Ruiz",
                phone: "(347) 134-5139",
                position: "Laborer",
                id: 13
            },
            {
                firstName: "Steven",
                lastName: "Glover",
                phone: "(823) 778-2511",
                position: "Laborer",
                id: 14
            },
            {
                firstName: "Lev",
                lastName: "Burks",
                phone: "(863) 781-5917",
                position: "Laborer",
                id: 15
            },
            {
                firstName: "Keegan",
                lastName: "Marsh",
                phone: "(616) 898-7429",
                position: "Laborer",
                id: 16
            }
        ];
        this.jobs = [];

        this.tabManager = new TabManager({ 
            tabSelector: '[data-app-tab-for]', 
            paneSelector: '[data-app-tab-pane]', 
            defaultId: 'calendar'
        });
        this.scheduleManager = new ScheduleManager({
            body: '#scheduler-body',
            header: '#scheduler-header',
            employeeList: this.employees,
        });
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
    constructor({ header, body, employeeList }) {
        this.header = document.querySelector(header);
        this.body = document.querySelector(body);
        this.selectedDate = null;
        this.employees = employeeList;
        this.jobEntry = {
            date: null,
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            addresses: [],
            startTime: '08:00 AM',
            trucks: 1,
            crew: [],
            jobType: 'Local',
            specialty: [],
            notes: ''
        }
        this.jobs = [];

        this.setSelectedDate();
        this.updateAvailableEmployees();
        document.querySelector('#job-entry-submit').addEventListener('click', e => {
            e.preventDefault();
            this.addJobEntryToJobs();
        })
        document.querySelector('#job-entry-form').addEventListener('input', e => {
            let targetId = e.target.id
            if(targetId.includes('-')) {
                targetId = targetId.split('-')
                targetId = targetId.map((word, i) => {
                    if(i !== 0) word = word[0].toUpperCase() + word.slice(1);
                    return word
                })
                targetId = targetId.join('')
            }

            if(this.jobEntry[targetId] !== undefined) this.jobEntry[targetId] = e.target.value;
            

            if(e.target.closest('fieldset').id.includes('address')) {
                let addressFieldset = e.target.closest('fieldset')
                let addressIndex = e.target.closest('fieldset').id
                addressIndex = +addressIndex.split('-')[1] - 1;
                if(!this.jobEntry.addresses[addressIndex]) {
                    let fieldsetInputs = addressFieldset.querySelectorAll('input, select')
                    this.jobEntry.addresses[addressIndex] = {
                        address1: fieldsetInputs[0].value,
                        address2: fieldsetInputs[1].value,
                        city: fieldsetInputs[2].value,
                        state: fieldsetInputs[3].value,
                        zipCode: fieldsetInputs[4].value,
                    }
                }
                this.jobEntry.addresses[addressIndex][targetId] = e.target.value;
            }

            if(e.target.name === 'specialty') {
                if(e.target.checked) {
                    !this.jobEntry.specialty.includes(e.target.value) && this.jobEntry.specialty.push(e.target.value);
                } else {
                    this.jobEntry.specialty.includes(e.target.value) &&
                        this.jobEntry.specialty.splice(this.jobEntry.specialty.findIndex(el => el === e.target.value), 1);
                }
            }
            console.log(this.jobEntry)
        })
    }

    addJobToTimeline() {
        const timelineContainer = document.querySelector('.timeline-container');
        this.jobs.forEach(job => {
            let jobCard = this.createJobCard(job);
            timelineContainer.appendChild(jobCard);
        })
    }

    editSubmittedJob() {

    }

    deleteTimelineJob() {

    }

    addJobEntryToJobs() {
        this.jobs.push(this.jobEntry);
        this.addJobToTimeline(this.jobEntry);
        document.querySelector('#job-entry-form').reset();
        this.jobEntry = {
            date: null,
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            addresses: [],
            startTime: '08:00 AM',
            trucks: 1,
            crew: [],
            jobType: 'Local',
            specialty: [],
            notes: ''
        }
    }

    createJobCard(job) {
        console.log(job)
        let container = document.createElement('div');
        let header = document.createElement('h2');
        let startEndAddresses = document.createElement('p');
        let jobInfo = document.createElement('p');
        let truckIcon = document.createElement('i');
        let crewIcon = document.createElement('i');
        let clockIcon = document.createElement('i');
        let houseIcon = document.createElement('i');
        let rightArrowIcon = document.createElement('i');
        let jobType = document.createElement('span');

        truckIcon.classList.add('fa-solid', 'fa-truck');
        crewIcon.classList.add('fa-solid', 'fa-user');
        clockIcon.classList.add('fa-solid', 'fa-clock');
        houseIcon.classList.add('fa-solid', 'fa-house');
        rightArrowIcon.classList.add('fa-solid', 'fa-arrow-right');

        header.textContent = job.customerName
        startEndAddresses.append(
            houseIcon, 
            `${job.addresses[0].city}, ${job.addresses[0].state}`,
            rightArrowIcon,
            `${job.addresses[job.addresses.length - 1].city}, ${job.addresses[job.addresses.length - 1].state}`
        )
        jobInfo.append(
            truckIcon,
            job.trucks,
            crewIcon,
            job.crew.length,
            clockIcon,
            job.startTime,
            jobType
        )

        jobType.textContent = job.jobType

        container.append(header, startEndAddresses, jobInfo);

        return container
    }

    createEmployeeCard(employee, add = true) {
        let { firstName, lastName, phone, position, id } = employee;
        let employeeCardEl = document.createElement('div'),
            nameEl = document.createElement('div'),
            positionEl = document.createElement('div'),
            phoneEl = document.createElement('div'),
            btnEl = document.createElement('button');

        employeeCardEl.classList.add('employee-card');
        nameEl.classList.add('employee-name');
        positionEl.classList.add('employee-position');
        phoneEl.classList.add('employee-phone');

        nameEl.textContent = `${firstName} ${lastName}`;
        positionEl.textContent = position;
        phoneEl.textContent = phone;

        if(add) {
            btnEl.classList.add('employee-add-btn');
            btnEl.textContent = 'Add'
            btnEl.addEventListener('click', () => {
                this.addEmployeeToJobEntry(employee);
            })
        } else {
            btnEl.classList.add('employee-remove-btn');
            btnEl.textContent = 'X'
            btnEl.addEventListener('click', event => {
                this.removeEmployeeFromJobEntry(event, employee);
            })
        }

        employeeCardEl.append(nameEl, positionEl, phoneEl, btnEl);
        return employeeCardEl;
    }

    updateAvailableEmployees() {
        let employeListDiv = document.getElementById('scheduler-employee-list');
        employeListDiv.innerHTML = '';

        this.employees.forEach(employee => {
            let employeeCard = this.createEmployeeCard(employee);
            employeListDiv.appendChild(employeeCard);
        })
    }

    removeAvailableEmployees(employeeId) {
        let employees = this.employees.filter(employee => employee.id !== employeeId)
        this.employees = employees;
        this.updateAvailableEmployees();
    }
    
    addAvailableEmployees(employee) {
        let employees = this.employees.filter(e => e.id === employee.id)
        if(!employees.length) {
            this.employees.push(employee);
            console.log(this.employees)
        }
        this.updateAvailableEmployees();
    }

    addEmployeeToJobEntry(employee) {
        let jobEntryCrewEl = document.querySelector('#crew');
        let employeeCard = this.createEmployeeCard(employee, false);
        jobEntryCrewEl.appendChild(employeeCard);
        this.removeAvailableEmployees(employee.id);
    }

    removeEmployeeFromJobEntry(event, employee) {
        event.preventDefault();
        event.currentTarget.parentElement.outerHTML = '';
        this.addAvailableEmployees(employee);
    }

    setSelectedDate(date = new Date()) {
        this.jobEntry.date = date;
        this.selectedDate = date;
        // this.jobEntry.date = date;
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