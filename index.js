const tabBtns = document.querySelectorAll('.tabs .tab');
const tabContents = document.querySelectorAll('.tab-contents > section');

if(tabBtns && tabContents) {
    tabBtns.forEach((tabBtn => {
        tabBtn.addEventListener('click', () => {
            const tabFor = tabBtn.getAttribute('data-for');

            tabBtns.forEach(btn => btn.classList.remove('active'))
            
            tabBtn.classList.add('active')

            tabContents.forEach(content => {
                content.classList.remove('active');
                if(content.id === tabFor) {
                    content.classList.add('active');
                }
            })
        })
    }))
}

class Calendar {
    constructor(year, month) {
        this.calenderDatesElement = document.querySelector('.dates-container');
        this.monthElement = document.querySelector('#month');
        this.currentDate = new Date();
        this.dateString = this.currentDate.toLocaleDateString('en-us', {
            weekday: 'long',
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            
        })
        this.year = year;
        this.month = month;
        this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 
        this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }
    
    getFirstDayOfMonth() {
        return new Date(this.year, this.month, 1).getDay();
    }
    
    getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    getMonth(year, month) {
        return new Date(year, month, 1).getMonth();
    }
    
    checkMonth(month) {
        if(month === -1) {
            return 11;
        } else if (month === 12) {
            return 0;
        } else {
            return month;
        }
    }
    
    previousMonth() {
        if(this.month === 0) {
            this.year -= 1;
        }
        this.month = this.checkMonth(this.month - 1);
        this.calenderDatesElement.innerHTML = '';
        this.render();
    }
    
    nextMonth() {
        if(this.month === 11) {
            this.year += 1;
        }
        this.month = this.checkMonth(this.month + 1);
        this.calenderDatesElement.innerHTML = '';
        this.render();
    }

    addEventListeners() {
        document.querySelectorAll('.day').forEach(day => {
            day.addEventListener('click', e => {
                tabBtns.forEach(tabBtn => {
                    if(tabBtn.getAttribute('data-for') === 'scheduling-pane') {
                        tabBtn.classList.add('active');
                    } else {
                        tabBtn.classList.remove('active');
                    }
                })
                tabContents.forEach(pane => {
                    if(pane.id === 'scheduling-pane') {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                })
                let schedulingPaneTitle = document.querySelector('#scheduling-pane > h1')
                let month = this.month, year = this.year;
                if(e.target.classList.contains('padding-before')) {
                    if(month === 0) year -= 1;
                    month = this.checkMonth(month - 1);
                }
                if(e.target.classList.contains('padding-after')) {
                    if(month === 11) year += 1;
                    month = this.checkMonth(month + 1);
                }
                schedulingPaneTitle.innerHTML = new Date(year, month, +e.target.innerHTML).toLocaleDateString('en-us', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })
            })
        })
    }
    
    render() {
        const currentMonthDays = this.getDaysInMonth(this.year, this.month);
        const prevMonthDays = this.getDaysInMonth(this.year, this.month - 1);
        const firstDayOfMonth = this.getFirstDayOfMonth();
        
        this.monthElement.innerHTML = `${this.monthNames[this.month]}, ${this.year}`;
        
        for(
            let i = 0, 
            day = 1, 
            prevDay = prevMonthDays - firstDayOfMonth + 1, 
            nextDay = 1;
            i < 42;
            i++
        ) {
            const dayDiv = document.createElement('div');
            if(i < firstDayOfMonth) {
                dayDiv.classList.add('day', 'padding-before');
                dayDiv.innerHTML = prevDay;
                prevDay++;
            } else if(i >= firstDayOfMonth && day <= currentMonthDays) {
                if(day === this.currentDate.getDate() && this.currentDate.getMonth() === this.month && this.currentDate.getFullYear() === this.year) {
                    dayDiv.classList.add('current-date');
                }
                dayDiv.classList.add('day');
                dayDiv.innerHTML = day;
                day++;
            } else {
                dayDiv.classList.add('day', 'padding-after');
                dayDiv.innerHTML = nextDay;
                nextDay++;
            }
            this.calenderDatesElement.appendChild(dayDiv);
        }
        this.addEventListeners();
    }
}

class Schedule extends Calendar {
    
}

const calendar = new Calendar(new Date().getFullYear(), new Date().getMonth());
calendar.render();

document.getElementById('previous').addEventListener('click', () => calendar.previousMonth());
document.getElementById('next').addEventListener('click', () => calendar.nextMonth());