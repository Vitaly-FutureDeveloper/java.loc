window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) //скрываем весь контент, кроме var a - количество не скрытых
    {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1); //скрываем весь контент, кроме var 1 - количество не скрытых

    function showTabContent(b) //Показываем, то что нужно
    {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }


    info.addEventListener('click', function(event){
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0); //скрываем весь контент, var 0 - не показываем ничего
                    showTabContent(i); //Показываем, то что выбрано
                    break;
                }
            }
        }
    });

    
    /*
    Timer
    */

   let deadline = "2019-12-28"; //Конечная дата

   /*Высчитывает разницу времени от конечной даты до сегодняшней
   вернёт объект Конечная дата, часы, минуты, сек.*/
       function getTimeRemaning(endtime){
           let t = Date.parse(endtime) - Date.parse(new Date()),
               seconds = Math.floor((t/1000) % 60),
               minutes = Math.floor((t/1000/60) % 60),
               hours = Math.floor((t/(1000*60*60)));
   
           return {
               'total' : t,
               'hours' : hours,
               'minutes' : minutes,
               'seconds' : seconds
           };
       }
   
       function setClock(id, endtime) {
           let timer = document.getElementById(id),
               hours = timer.querySelector('.hours'),
               minutes = timer.querySelector('.minutes'),
               seconds = timer.querySelector('.seconds'),
   /*после захвата строк в вёрстке - запускаем функцию updateClock() каждую 1сек*/
               timeInterval = setInterval(updateClock, 1000);
   
           function updateClock() //Подставляет значения в поля DOM по интервалу (выше)
           {
   //Запишем в переменную t объект "разница времени"
               let t = getTimeRemaning(endtime);
   
   /*группа проверок на кол-во цифр, чтоб не было по 1, а было 01*/
                   if(t.hours.toString().length == '1') {
                       t.hours = "0" + t.hours;
                   }
                   if(t.minutes.toString().length == '1') {
                       t.minutes = "0" + t.minutes;
                   }
                   if(t.seconds.toString().length == '1') {
                       t.seconds = "0" + t.seconds;
                   }
   /*Пишем в DOM обекты таймера: часы, минуты, сек*/
               hours.textContent = t.hours;
               minutes.textContent = t.minutes;
               seconds.textContent = t.seconds;
   
   /*Приверка на "время закончилось", прерывание интервала*/
               if(t.total <= 0 ) {
                   clearInterval(timeInterval);
                       hours.textContent = '00';
                       minutes.textContent = '00';
                       seconds.textContent = '00';
               }
           }
       }
   
       setClock('timer', deadline);

           /*
    MODAL
    */

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    function displayOn() //Включает модальное окно
    {
        overlay.style.display = 'block';
        more.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    }

        more.addEventListener('click', function(){
            displayOn(); //Включает модальное окно
        });

        close.addEventListener('click', function(){
            overlay.style.display = 'none';
            more.classList.remove('more-splash');
            document.body.style.overflow = '';
        });

        /*
        Modal УЗНАТЬ ПОДРОБНЕЕ
        */

    let bet = document.querySelectorAll('.description-btn'); //Получаем все кнопки "УЗНАТЬ ПОДРОБНЕЕ"
    for(let i = 0; bet.length > i; i++) {   //Циклом формируем событие для каждой из кнопок
        bet[i].addEventListener('click', function(){
            displayOn(); //Включает модальное окно
        });
    }

    //Form

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо, скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');

    form.addEventListener('submit', function(event){
        event.preventDefault(); //отключаем стандартное поведение кнопки
        form.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php'); //Настраиваем запрос в builder
        //request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //Меняем заголовок, для JSON формата
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        let formData = new FormData(form); //Конструктор формирует запрос
        let obj = {};
        formData.forEach(function(value, key) { //Подготовка для преобразования в JSON формат
            obj[key] = value;
        });
        let json = JSON.stringify(obj);

        request.send(json);//Открывает запрос и отправляет на сервер

        request.addEventListener('readystatechange', function(){
            if(request.readyState < 4){
                statusMessage.innerHTML = message.loading;
            } else if(request.readyState === 4 && request.status == 200){
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        for(let i = 0; i < input.length; i++){
            input[i].value = '';
        }
    });

    //Modal form

    let formEmail = document.querySelector('#form'),
        inputs = formEmail.getElementsByTagName('input');

    formEmail.addEventListener('submit', function(event){
        event.preventDefault();
        formEmail.appendChild(statusMessage); //Ставим созданный заранее div под форму для показа статуса

        //Настройка запроса
        let request = new XMLHttpRequest();

            request.open('POST', 'server.php');
            request.setRequestHeader('Content-Type', 'Application/json; charset=utf-8');

        //Формируем запрос в формате JSON
        let formDataMail = new FormData(formEmail);
        let obj = {};

            formDataMail.forEach(function(value, key){
                obj[key] = value;
            });
            let json = JSON.stringify(obj);

            request.send(json); 

        //Событие для отслеживания состояний запроса
        request.addEventListener('readystatechange', function(){
            if( request.readyState < 4 ){
                statusMessage.innerHTML = message.loading;
                //При успехе очищаем все поля формы
                    for(let i = 0; i < inputs.length; i++){
                        inputs[i].value = '';
                    }
            } else if ( request.readyState === 4 && request.status == 200 ){
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });
    });

    //Slider

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    showSlides(slideIndex);

    function showSlides(n){

        if( n > slides.length ){
            slideIndex = 1;
        }
        if (n < 1){
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');

        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n){
        showSlides(slideIndex += n);
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function(){
        plusSlides(-1);
    });
    next.addEventListener('click', function(){
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(event){
        for(let i = 0; i < dots.length + 1; i++){
            if(event.target.classList.contains('dot') && event.target == dots[i-1])
                currentSlide(i);
        }
    });

    setInterval( () => next.click(), 3000 );


    /*
    CALCULATOR
    */

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        total = 0;

        totalValue.innerHTML = 0;

    persons.addEventListener('change', function(){
        personsSum = +this.value;
        total = (daysSum + personsSum)*4000;

        if(restDays.value == ''){
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    restDays.addEventListener('change', function(){
        daysSum = +this.value;
        total = (daysSum + personsSum)*4000;

        if(persons.value == ''){
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });

    place.addEventListener('change', function(){
        if(restDays.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
        } else {
            let a = total; //Техническая переменная, для безопасного расчёта из select
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });

});//////////  END PROGRAMM    ////////////


