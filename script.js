

const eventsData = [
    { date: '2023-01-15', title: 'Мастер-класс «5 психотипов покупателей в фэшн»', tag: 'Для предпринимателей' },
    { date: '2023-01-20', title: 'Вебинар «Как открыть своё дело с нуля»', tag: 'Для начинающих' },
    { date: '2023-01-25', title: 'Консультация юриста по налогам', tag: 'Для ИП' },
    { date: '2023-02-05', title: 'Тренинг «Управление командой»', tag: 'Для руководителей' },
    { date: '2023-02-14', title: 'Форум «Женское предпринимательство»', tag: 'Для всех' }
];

let currentEventIndex = 0;
let currentMonth = 0; 
let currentYear = 2023;


const sliderWrapper = document.querySelector('.slider__wrapper');
const slides = document.querySelectorAll('.slider__slide');
const prevBtn = document.querySelector('.slider__btn--prev');
const nextBtn = document.querySelector('.slider__btn--next');

let currentIndex = 0;
const totalSlides = slides.length;
let autoSlideInterval;
let lastManualClick = 0;

function goToSlide(index) {
    
    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

  
    const activeSlide = slides[currentIndex];
    const wrapper = document.querySelector('.slider__wrapper');
    
    
    const slideRect = activeSlide.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    
    
    const offset = slideRect.left - wrapperRect.left;
    
    
    const paddingLeft = document.querySelector('.hero__slider').offsetWidth * 0.1;
    
    wrapper.style.transform = `translateX(-${offset - paddingLeft}px)`;

  
    const currentNum = String(currentIndex + 1).padStart(2, '0');
    document.querySelector('.hero__pagination-current').textContent = currentNum;
    const progress = ((currentIndex + 1) / totalSlides) * 100;
    document.querySelector('.hero__pagination-progress').style.width = `${progress}%`;

    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
    });
}

let autoSlideTimeout;


function startAutoSlide() {
    
    clearInterval(autoSlideInterval);
    
    clearTimeout(autoSlideTimeout);
    
   
    autoSlideTimeout = setTimeout(() => {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 3000);
    }, 500); 
}


nextBtn.addEventListener('click', () => {
    console.log('Кнопка Вперед. currentIndex =', currentIndex, 'totalSlides =', totalSlides);
    lastManualClick = Date.now();
    goToSlide(currentIndex + 1);
    startAutoSlide();
});

prevBtn.addEventListener('click', () => {
    lastManualClick = Date.now();
    goToSlide(currentIndex - 1);
    startAutoSlide();
});


window.addEventListener('resize', () => {
    goToSlide(currentIndex);
});


startAutoSlide();



function renderMonth(year, month) {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7;
    startDay = startDay - 1;

    
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar__day', 'calendar__day--empty');
        grid.appendChild(emptyDay);
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar__day');
        dayElement.textContent = day;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayElement.dataset.date = dateStr;

        const hasEvent = eventsData.some(event => event.date === dateStr);
        if (hasEvent) {
            dayElement.classList.add('calendar__day--event');
        }

        dayElement.addEventListener('click', () => {
            selectDate(dateStr);
        });

        grid.appendChild(dayElement);
    }
}

function selectDate(dateStr) {
    const eventIndex = eventsData.findIndex(event => event.date === dateStr);
    if (eventIndex !== -1) {
        currentEventIndex = eventIndex;
        updateAnnounce();
        highlightDate(dateStr);
    }
}

function highlightDate(dateStr) {
    document.querySelectorAll('.calendar__day').forEach(day => {
        day.classList.remove('calendar__day--selected');
    });
    const selectedDay = document.querySelector(`.calendar__day[data-date="${dateStr}"]`);
    if (selectedDay) {
        selectedDay.classList.add('calendar__day--selected');
    }
}

function updateAnnounce() {
    const event = eventsData[currentEventIndex];
    const dateParts = event.date.split('-');
    const displayDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0].slice(2)}`;

    document.getElementById('announceDate').textContent = displayDate;
    document.getElementById('announceTitle').textContent = event.title;
    document.getElementById('announceTag').textContent = event.tag;

    highlightDate(event.date);
}

function updateCalendar() {
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    document.querySelector('.calendar__month-title').textContent =
        `${monthNames[currentMonth]} ${currentYear}`;

    renderMonth(currentYear, currentMonth);

    const currentEvent = eventsData[currentEventIndex];
    const eventDate = new Date(currentEvent.date);
    
    if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
        updateAnnounce();
    } else {
        document.querySelectorAll('.calendar__day').forEach(day => {
            day.classList.remove('calendar__day--selected');
        });
    }
}


document.querySelector('.calendar__nav--prev').addEventListener('click', () => {
    if (currentMonth === 0 && currentYear === 2023) {
        return;
    }
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
    startAutoEvent();
});

document.querySelector('.calendar__nav--next').addEventListener('click', () => {
    if (currentMonth === 1 && currentYear === 2023) {
        return;
    }
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
    startAutoEvent();
});


document.querySelector('.announce__btn--next').addEventListener('click', () => {
    currentEventIndex = (currentEventIndex + 1) % eventsData.length;
    
    const eventDate = new Date(eventsData[currentEventIndex].date);
    currentMonth = eventDate.getMonth();
    currentYear = eventDate.getFullYear();
    
    updateCalendar();
    startAutoEvent();
});

document.querySelector('.announce__btn--prev').addEventListener('click', () => {
    currentEventIndex = (currentEventIndex - 1 + eventsData.length) % eventsData.length;
    
    const eventDate = new Date(eventsData[currentEventIndex].date);
    currentMonth = eventDate.getMonth();
    currentYear = eventDate.getFullYear();
    
    updateCalendar();
    startAutoEvent();
});


let autoEventInterval;

function startAutoEvent() {
    clearInterval(autoEventInterval);
    autoEventInterval = setInterval(() => {
        currentEventIndex = (currentEventIndex + 1) % eventsData.length;
        const eventDate = new Date(eventsData[currentEventIndex].date);
        if (eventDate.getMonth() !== currentMonth) {
            currentMonth = eventDate.getMonth();
            currentYear = eventDate.getFullYear();
            updateCalendar();
        } else {
            updateAnnounce();
        }
    }, 3000);
}


updateCalendar();
startAutoEvent();



const modal = document.getElementById('requestModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const form = document.getElementById('requestForm');

openModalBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
});

function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    form.reset();
    document.querySelectorAll('.form__input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.form__error').forEach(error => {
        error.textContent = '';
    });
}

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});


function validateName() {
    const input = document.getElementById('userName');
    const error = document.getElementById('userNameError');
    const value = input.value.trim();
    if (value.length < 2) {
        input.classList.add('error');
        error.textContent = 'Введите имя (минимум 2 символа)';
        return false;
    } else {
        input.classList.remove('error');
        error.textContent = '';
        return true;
    }
}

function validatePhone() {
    const input = document.getElementById('userPhone');
    const error = document.getElementById('userPhoneError');
    const value = input.value.trim();
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) {
        input.classList.add('error');
        error.textContent = 'Введите корректный номер телефона';
        return false;
    } else {
        input.classList.remove('error');
        error.textContent = '';
        return true;
    }
}

function validateEmail() {
    const input = document.getElementById('userEmail');
    const error = document.getElementById('userEmailError');
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        input.classList.add('error');
        error.textContent = 'Введите корректный email';
        return false;
    } else {
        input.classList.remove('error');
        error.textContent = '';
        return true;
    }
}

function validateService() {
    const input = document.getElementById('userService');
    const error = document.getElementById('userServiceError');
    if (input.value === '') {
        input.classList.add('error');
        error.textContent = 'Выберите услугу';
        return false;
    } else {
        input.classList.remove('error');
        error.textContent = '';
        return true;
    }
}

function validateAgreement() {
    const checkbox = document.getElementById('userAgreement');
    const error = document.getElementById('agreementError');
    if (!checkbox.checked) {
        error.textContent = 'Необходимо согласие на обработку данных';
        return false;
    } else {
        error.textContent = '';
        return true;
    }
}

function updateCalendarNav() {
    const prevBtn = document.querySelector('.calendar__nav--prev');
    const nextBtn = document.querySelector('.calendar__nav--next');
    
    if (currentMonth === 0 && currentYear === 2023) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
    
    if (currentMonth === 1 && currentYear === 2023) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

document.getElementById('userName').addEventListener('input', validateName);
document.getElementById('userPhone').addEventListener('input', validatePhone);
document.getElementById('userEmail').addEventListener('input', validateEmail);
document.getElementById('userService').addEventListener('change', validateService);
document.getElementById('userAgreement').addEventListener('change', validateAgreement);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    const isEmailValid = validateEmail();
    const isServiceValid = validateService();
    const isAgreementValid = validateAgreement();

    if (isNameValid && isPhoneValid && isEmailValid && isServiceValid && isAgreementValid) {
        alert('Спасибо! Ваша заявка отправлена.');
        closeModal();
    } else {
        alert('Пожалуйста, исправьте ошибки в форме.');
    }
});