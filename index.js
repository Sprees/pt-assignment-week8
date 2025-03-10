class App {
    constructor() {
        this.tabManager = new TabManager();
        this.scheduleManager = new ScheduleManager();
        this.calendar = new Calendar();
    }

    init() {
        this.calendar.render();
        document.getElementById('previous').addEventListener('click', () => this.calendar.previousMonth());
        document.getElementById('next').addEventListener('click', () => this.calendar.nextMonth());
    }

    handleDayClick() {

    }
}

class TabManager {
    constructor() {

    }
}

class ScheduleManager {
    constructor() {

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

        this.onDayClick = onDayClick || (() => {});
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

    getMonth(num = 0, month = this.month, year = this.year, today = false) {
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
        let containerElCount = 0,
            firstDayOfMonth = new Date(this.year, this.month, 1).getDay(),
            curMoTotalDays = this.getDaysInMonth(1), 
            prevMoTotalDays = this.getDaysInMonth(),
            prevMoDaysCount = (prevMoTotalDays - firstDayOfMonth) + 1,
            curMoDaysCount = 1,
            nextMoDaysCount = 1;

        while(containerElCount < 42) {
            let dayDiv = document.createElement('div');
            let dayNum = document.createElement('p');

            dayDiv.classList.add('day');
            dayNum.classList.add('day-number')
            
            if(containerElCount < firstDayOfMonth) {
                dayDiv.classList.add('day-prev')
                dayNum.classList.add('day-number-prev')
                dayNum.innerHTML = '' + prevMoDaysCount;
                prevMoDaysCount++
            } else if (curMoDaysCount <= curMoTotalDays) {
                if(this.isCurrentDate(curMoDaysCount, this.month, this.year)) {
                    dayDiv.classList.add('day-today')
                    dayNum.classList.add('day-number-today');
                }
                dayNum.classList.add('day-number-cur')
                dayNum.innerHTML = '' + curMoDaysCount;
                curMoDaysCount++
            } else {
                dayDiv.classList.add('day-next')
                dayNum.classList.add('day-number-next')
                dayNum.innerHTML = '' + nextMoDaysCount;
                nextMoDaysCount++
            }
            
            dayDiv.appendChild(dayNum);
            this.body.appendChild(dayDiv);

            containerElCount++
        }
    }

    createCalendarHeader() {
        let todayString = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleDateString('en-us', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })

        let monthYearString = new Date(this.year, this.month, 1).toLocaleDateString('en-us', {
            month: 'long',
            year: 'numeric'
        })

        monthYearString = monthYearString.split(' ').join(', ');

        const prevBtn = document.createElement('button'),
              nextBtn = document.createElement('button'),
              todayStringH1 = document.createElement('h1'),
              monthYearStringH1 = document.createElement('h1');

        prevBtn.classList.add('header-btn');
        nextBtn.classList.add('header-btn');

        prevBtn.textContent = 'Previous'
        nextBtn.textContent = 'Next'

        todayStringH1.textContent = todayString;
        monthYearStringH1.textContent = monthYearString;

        this.header.appendChild(todayStringH1);
        let div = document.createElement('div');
        this.header.appendChild(div).append(prevBtn, monthYearStringH1, nextBtn);

        prevBtn.addEventListener('click', () => this.getMonth(-1));
        nextBtn.addEventListener('click', () => this.getMonth(1));
        todayStringH1.addEventListener('click', (e) => this.getMonth(0, this.month, this.year, true));
    }

    render() {
        this.body.innerHTML = '';
        this.header.innerHTML = '';

        this.createCalendarHeader();
        this.createCalendarBody();
    }
}

const calendar = new Calendar({ body: '#calendar-body', header: '#calendar-header', date: new Date() });
calendar.render();
console.log(calendar)