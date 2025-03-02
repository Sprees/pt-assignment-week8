class Calendar {
    constructor(year, month) {
        this.calenderDatesElement = document.querySelector('.dates-container');
        this.monthElement = document.querySelector('#month');
        this.currentDate = new Date();
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

    previousMonth() {
        this.month = this.month - 1;
        this.calenderDatesElement.innerHTML = '';
        this.render();
    }

    nextMonth() {
        this.month = this.month + 1;
        this.calenderDatesElement.innerHTML = '';
        this.render();
    }

    render() {
        const currentMonth = this.getMonth(this.year, this.month);
        const prevMonth = this.getMonth(this.year, this.month - 1);
        const nextMonth = this.getMonth(this.year, this.month + 1);

        const currentMonthDays = this.getDaysInMonth(this.year, this.month);
        const prevMonthDays = this.getDaysInMonth(this.year, this.month - 1);
        const firstDayOfMonth = this.getFirstDayOfMonth();

        this.monthElement.innerHTML = this.monthNames[this.month];
        
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
                dayDiv.classList.add('day', 'padding');
                dayDiv.innerHTML = prevDay;
                prevDay++;
            } else if(i >= firstDayOfMonth && day <= currentMonthDays) {
                dayDiv.classList.add('day');
                dayDiv.innerHTML = day;
                day++;
            } else {
                dayDiv.classList.add('day', 'padding');
                dayDiv.innerHTML = nextDay;
                nextDay++;
            }
            this.calenderDatesElement.appendChild(dayDiv);
        }
    }
}

const calendar = new Calendar(new Date().getFullYear(), new Date().getMonth());
calendar.render();

document.getElementById('previous').addEventListener('click', () => calendar.previousMonth());
document.getElementById('next').addEventListener('click', () => calendar.nextMonth());