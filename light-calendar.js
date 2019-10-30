var lightCalendar = {
    settings: {
    },
    weekStart: 0, //Day of the week start. 0 (Sunday) to 6 (Saturday)
    views: {
        days: 0,
        months: 1,
        years: 2,
    },
    themes: {
        light: 0,
        dark: 1,
    },
    months: [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
        // "January","February","March","April","May","June","July","August","September","October","November","December"
    ],
    days: [
        "lunedì",
        "martedi",
        "mercoledì",
        "giovedì",
        "venerdì",
        "sabato",
        "domenica"
        // "monday"
        // "tuesday"
        // "wednesday"
        // "thursday"
        // "friday"
        // "saturday"
        // "sunday"
    ],
    daysInMonth: function (month, year) {
        return new Date(year, month + 1, 0).getDate();
    },
    addMonth: function (day) {
        this.activeDay = "";
        if (typeof day != "undefined") {
            this.activeDay = day;
        }
        this.activeMonth += 1;
        if (this.activeMonth > 11) {
            this.activeMonth = 0;
            this.activeYear += 1;
        }
        this.refresh();
    },
    removeMonth: function (day) {
        this.activeDay = "";
        if (typeof day != "undefined") {
            this.activeDay = day;
        }
        this.activeMonth -= 1;
        if (this.activeMonth < 0) {
            this.activeMonth = 11;
            this.activeYear -= 1;
        }
        this.refresh();
    },
    activeDay: 0,
    activeMonth: 0,
    activeYear: 0,
    container: null,
    slider: {
        target: null,
        x0: null,
        i: 0,
        lock: function (e) {
            lightCalendar.slider.x0 = lightCalendar.slider.unify(e).clientX;
        },
        move: function (e) {
            if (lightCalendar.slider.x0 || lightCalendar.slider.x0 === 0) {
                let dx = lightCalendar.slider.unify(e).clientX - lightCalendar.slider.x0, s = Math.sign(dx);
                var offset = 100;
                if (dx < offset*-1){
                    lightCalendar.addMonth();
                }else if(dx > offset){
                    lightCalendar.removeMonth();
                }
            }
        },
        unify: function (e) { return e.changedTouches ? e.changedTouches[0] : e }
    },
    init: function (id) {
        var _settings = {
            startView: this.views.days,//this.views
            startDate: new Date(),
            theme: this.themes.light,
        };
        this.activeMonth = new Date().getMonth();
        this.activeYear = new Date().getFullYear();
        this.container = document.getElementById(id);

        this.slider.target = this.container;
        this.container.addEventListener('mousedown', this.slider.lock, false);
        this.container.addEventListener('touchstart', this.slider.lock, false);
        this.container.addEventListener('mouseup', this.slider.move, false);
        this.container.addEventListener('touchend', this.slider.move, false);

        this.refresh();
    },
    refresh: function () {
        this.container.innerHTML = "";
        this.container.className = (this.container.className + " lc-calendar").trim();
        var header = document.createElement("div");
        header.className = "lc-header";
        var body = document.createElement("div");
        body.className = "lc-body";
        var footer = document.createElement("div");
        footer.className = "lc-footer";
        //HEADER
        this.container.appendChild(header);

        var arrowLeft = document.createElement("div");
        arrowLeft.className = "lc-arrow-left";
        arrowLeft.addEventListener("click", function () {
            lightCalendar.removeMonth();
        });
        var arrowRight = document.createElement("div");
        arrowRight.className = "lc-arrow-right";
        arrowRight.addEventListener("click", function () {
            lightCalendar.addMonth();
        });
        var month = document.createElement("div");
        month.className = "lc-month";
        month.innerText = this.months[this.activeMonth] + " " + this.activeYear;
        header.appendChild(arrowLeft);
        header.appendChild(arrowRight);
        header.appendChild(month);
        //BODY
        this.container.appendChild(body);
        var tbl = document.createElement('table');
        tbl.className = 'lc-cal-days';
        var tbdy = document.createElement('tbody');
        var day = 1;
        var maxDays = this.daysInMonth(this.activeMonth, this.activeYear);
        console.log(maxDays);

        //DAYS
        var tr = document.createElement('tr');
        var day = this.weekStart;
        for (var i = 0; i < 7; i++) {
            var th = document.createElement('th');
            th.innerHTML = this.days[day].substr(0, 3);
            tr.appendChild(th);
            day++;
            if (day >= 7) {
                day = 0;
            }
        };
        tbdy.appendChild(tr);

        var nextMonth = false;
        var prevMonth = true;
        day = 1;
        i = 0;
        while (!nextMonth) {
            var tr = document.createElement('tr');
            var nextMonth = false;
            for (var j = 0; j < 7; j++) {
                if (prevMonth) {
                    var firstDayWeek = new Date(this.activeYear, this.activeMonth, 1).getDay() - 1;
                    if (firstDayWeek == -1) {
                        firstDayWeek = 6;
                    }
                    if (firstDayWeek != i) {
                        lastMonth = this.activeMonth - 1;
                        lastYear = this.activeYear;
                        if (lastMonth < 0) {
                            lastMonth = 11;
                            lastYear -= 1;
                        }
                        var lastMonthLastDay = this.daysInMonth(lastMonth, lastYear);
                        day = lastMonthLastDay - firstDayWeek + 1 + i;
                    } else {
                        day = 1;
                        prevMonth = false;
                    }
                }
                var td = document.createElement('td');
                var tdNumberContainer = document.createElement('div');
                tdNumberContainer.classList = "number-container" + (nextMonth ? " next-month" : (prevMonth ? " prev-month" : (this.activeDay == day ? " active" : ""))) + (Math.round(Math.random()) == 0 ? "" : " notification");
                tdNumberContainer.dataset.number = day;
                var tdNumber = document.createElement('div');
                tdNumber.innerHTML = day;
                tdNumber.classList = "number";
                tdNumberContainer.appendChild(tdNumber);
                td.appendChild(tdNumberContainer);
                tr.appendChild(td);
                tdNumberContainer.addEventListener("click", function () {
                    document.querySelectorAll(".number-container.active").forEach(function (div) {
                        div.className = div.className.replace("active", "");
                    });
                    if (this.className.split(" ").indexOf("active") < 0) {
                        lightCalendar.activeDay = this.dataset.number;
                        this.className = (this.className + " active").trim();
                    }
                    if (this.className.split(" ").indexOf("next-month") >= 0) {
                        lightCalendar.addMonth(this.dataset.number);
                    } else if (this.className.split(" ").indexOf("prev-month") >= 0) {
                        lightCalendar.removeMonth(this.dataset.number);
                    }
                });
                i++;
                day++;
                if (!prevMonth && day > maxDays) {
                    day = 1;
                    nextMonth = true;
                }
            }
            tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
        body.appendChild(tbl)

        //FOOTER
        this.container.appendChild(footer);
    }
}