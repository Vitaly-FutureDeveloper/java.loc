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

   let deadline = "2019-10-20"; //Конечная дата

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
   /*Пишем в DOM обекты таймера: часы, минуты, сек - время по нулям*/
                       hours.textContent = '00';
                       minutes.textContent = '00';
                       seconds.textContent = '00';
               }
           }
       }
   
       setClock('timer', deadline);

});


