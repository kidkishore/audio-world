import React, { Component } from 'react';
import '../index.css'
import $ from 'jquery';

export default class CountDown extends Component {

  componentDidMount() {
    $(function() {
      var initializeWatchClock = function(id, endtime) {
        var clock = document.getElementById(id);
        var daysSpan = clock.querySelector('.days');
        var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');

        var updateWatchClock = function() {
          var t = getTimeRemaining(endtime);

          daysSpan.innerHTML = t.days;
          hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
          minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
          secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

          if (t.total <= 0) {
            clearInterval(interval);
          }
        }

        //Update clock Watch!
        updateWatchClock();
        var interval = setInterval(updateWatchClock, 1000);
      };

      var getTimeRemaining = function(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));

        return {
          'total': t,
          'days': days,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
        };
      };

      //Calculation for happy new year!
      let nextYear = new Date(new Date().getFullYear() + 1, 0, 1);
      let today = Date.parse(new Date());
      let newYearDay = new Date(nextYear);
      let remaningDT = newYearDay - today;
      let remanning = new Date(Date.parse(new Date()) + remaningDT);

      initializeWatchClock('happyNewYear-div', remanning);
    });
  }

  render() {
    return (
      <div className="CountDown">
        <div className="newYearText">Happy New Year!</div>
        <div id="happyNewYear-div">
          <div>
            <span className="days"></span><div className="smalltext">Days</div>
          </div>
          <div>
            <span className="hours"></span><div className="smalltext">Hours</div>
          </div>
          <div>
            <span className="minutes"></span><div className="smalltext">Minutes</div>
          </div>
          <div>
            <span className="seconds"></span><div className="smalltext">Seconds</div>
          </div>
        </div>
      </div>
    );
  }
}