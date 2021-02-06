import SlimSelect from 'slim-select';

const filter = document.querySelector('.filter__select'),
    addEvent = document.querySelector('.addEvent'),
    deleteModal = document.querySelector('.calendar__modal'),
    cancelBtn = document.querySelector('.btn--passive'),
    removeBtn = document.querySelector('.btn--danger'),
    createModal = document.querySelector('.createEvent'),
    nameInput = document.querySelector('#eventName'),
    participantsSelect = document.querySelector('#eventParticipants'),
    daySelect = document.querySelector('#eventDay'),
    timeSelect = document.querySelector('#eventTime'),
    eventCancelBtn = document.querySelector('.btn--passiveEvent'),
    eventCreateBtn = document.querySelector('.btn--createEvent'),
    backdrop = document.querySelector('.backdrop'),
    item = document.querySelectorAll('td'),
    createEventErrors = document.querySelector('.createEvent__errors'),
    errorMessage = document.querySelector('.message'),
    members = new SlimSelect({
        select: '#eventParticipants',
        placeholder: 'Chouse at least 1 member',
        showContent: 'down',
        selectByGroup: true
    });
let events,
    meetings = [];


class Event extends Object {
    constructor(_title, _members, _time, _day) {
        super();
        this.title = _title;
        this.members = _members;
        this.day = _day;
        this.time = _time;
        this.index = `${dayIndex(this.day)}_${timeIndex(this.time)}`;
    }
};


function dayIndex(day) {
    switch (day) {
        case "Monday": return 1;
        case "Tuesday": return 2;
        case "Wednesday": return 3;
        case "Thursday": return 4;
        case "Friday": return 5;
    }
};

function timeIndex(time) {
    switch (time) {
        case "10:00": return 1;
        case "11:00": return 2;
        case "12:00": return 3;
        case "13:00": return 4;
        case "14:00": return 5;
        case "15:00": return 6;
        case "16:00": return 7;
        case "17:00": return 8;
        case "18:00": return 9;
    }
};

function createObj() {
    const event = new Event(nameInput.value, members.selected(), timeSelect.value, daySelect.value);
    meetings.push(event);
    localStorage.setItem('schedule', JSON.stringify(meetings));
    return meetings;
};

function localBox() {
    if (localStorage.getItem('schedule') === null) {
        events = [];
        return events;
    }
    else {
        events = JSON.parse(localStorage.getItem('schedule'));
        meetings = [...events];
        return events;
    }
};

function makeVisible(element) {
    element.classList.add('visible');
    backdrop.classList.add('visible');
};

function clearForm() {
    nameInput.value = '';
    timeSelect.value = '';
    daySelect.value = '';
    members.set([]);
    filter.value = 'all events';
};

function hideModal(element) {
    element.classList.remove('visible');
    backdrop.classList.remove('visible');
};

function busyCell(arr) {
    arr.map(event => {
        let cell = document.getElementById(`${event.index}`);
        cell.textContent = event.title;
        cell.classList.add('busy');
    });
};

busyCell(localBox());
function errors(message) {
    errorMessage.textContent = message;
    createEventErrors.classList.add('visible');
    setTimeout(() => {
        createEventErrors.classList.remove('visible');
        errorMessage.textContent = '';
    }, 5000);
};

function validation() {
    if (!nameInput.value) {
        errors('You did not fill Title Input');
    }
    else if (!participantsSelect.value) {
        errors('You have to choose at least 1 member')
    }
    else if (events.map(e => e.index).includes(`${dayIndex(daySelect.value)}_${timeIndex(timeSelect.value)}`)) {
        errors('This time is already taken, choose another one.');
    }
    else {
        createObj();
        busyCell(localBox());
        hideModal(createModal);
        clearForm();
    }
};


addEvent.addEventListener('click', function () {
    makeVisible(createModal);
});
eventCreateBtn.addEventListener('click', e => {
    e.preventDefault();
    validation();
});
eventCancelBtn.addEventListener('click', e => {
    e.preventDefault();
    hideModal(createModal);
});



//////////filter
function clear() {
    item.forEach(e => {
        e.classList.remove('busy');
        e.textContent = '';
    })
};

function filterEvents() {
    let res = events.filter((event) => {
        return event.members.includes(filter.value);
    })
    busyCell(res);
};
filter.addEventListener('change', () => {
    clear();
    if (filter.value === 'all events') {
        busyCell(events);
    }
    else {
        filterEvents();
    }
});



////////delete
let indexId;
function removeCell() {
    let index = events.findIndex(e => indexId === e.index);
    events.splice(index, 1);
    meetings = [...events];
    localStorage.setItem('schedule', JSON.stringify(meetings));
    console.log(events)
}
item.forEach(i => i.addEventListener('click', () => {
    if (i.classList.contains('busy')) {
        makeVisible(deleteModal);
        return indexId = i.id;
    }

}));

cancelBtn.addEventListener('click', e => {
    e.preventDefault();
    hideModal(deleteModal);
});
removeBtn.addEventListener('click', e => {
    e.preventDefault();
    removeCell();
    clear();
    busyCell(events);
    hideModal(deleteModal);
})


