import moment from 'moment';

class GoogleCalendarCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.header = this.config.name;
      this.content = document.createElement('div');
      this.content.style.padding = '0 16px 16px';
      card.appendChild(this.content);
      this.appendChild(card);
      console.log(hass);
    }

    this
      .getAllEvents(this.config.entities)
      .then(data => this.updateHtmlIfNecessary(data))
      .catch(error => console.log('error', error));
  }

  async getAllEvents(entities) {
    const start = moment().format("YYYY-MM-DDTHH:mm:ss");
    const end = moment().add(7, 'days').format("YYYY-MM-DDTHH:mm:ss");

    let urls = entities
      .map(entity => `/api/calendars/${entity}?start=${start}Z&end=${end}Z`)
    let allResults = await this.getAllUrls(urls)
    let result = [].concat.apply([], allResults);
    result.forEach(item => {
      if (item.start.date) {
        let dateTime = new Date(Date.parse(item.start.date));
        item.start.dateTime = dateTime.toISOString();
      }
    });
    result.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));
    return result;
  }

  async getAllUrls(urls) {
    try {
      var data = await Promise.all(
        urls.map(
          url =>
            fetch(url).then(
              (response) => { return response.json() }
            )));
      return (data)
    } catch (error) {
      console.log(error)
      throw (error)
    }
  }

  updateHtmlIfNecessary(events) {
    if(this.isSomethingChanged(events)) {
      this.events = JSON.parse(JSON.stringify(events));
      this.content.innerHTML = `
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
        <style>
          .day-wrapper {
            border-bottom: 1px solid rgba(0,0,0,.12);
            margin-bottom: 10px;
          }

          .day-wrapper:last-child {
            border-bottom: none;
          }

          .day {
            display: flex;
            flex-direction: row;
            width: 100%;
          }

          .date {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: top;
            flex: 0 1 40px;
          }

          .events {
            flex: 1 1 auto;
          }

          .event-wrapper {
            padding: 5px;
            margin-left: 10px;
          }

          .event {
            flex: 0 1 auto;
            display: flex;
            flex-direction: column;
          }

          .info {
            display: flex;
            width: 100%;
            justify-content: space-between;
            flex-direction: row;
          }

          .congrats {
            cursor: pointer;
          }

          .time {
            font-size: smaller;
            color: rgba(0,0,0,.62);
          }

          .now {
            color: #03a9f4;
          }

          hr.now {
            border-style: solid;
            border-color: #03a9f4;
            border-width: 1px 0 0 0;
            margin-top: -9px;
          }
        </style>
      `;

      let now = {start: {dateTime: moment().format()}, type: 'now'}
      events.push(now);
      events.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));

      let groupedEventsPerDay = this.groupBy(events, event => moment(new Date(event.start.dateTime)).format('YYYY-MM-DD'));

      groupedEventsPerDay.forEach((events, day) => {
        let eventStateCardContentElement = document.createElement('div');
        eventStateCardContentElement.classList.add('day-wrapper');
        eventStateCardContentElement.innerHTML = this.getDayHtml(day, events);
        this.content.append(eventStateCardContentElement);
      });
    }
  }

  getDayHtml(day, events) {
    let clazz = moment().format('DD') === moment(day).format('DD') ? 'date now' : 'date';
    return `
      <div class="day">
        <div class="${clazz}">
          <div>${moment(day).format('DD')}</div>
          <div>${moment(day).format('ddd')}</div>
        </div>
        <div class="events">${events.map(event => this.getEventHtml(event)).join('')}</div>
      </div>`;
  }

  getEventHtml(event) {
    if(event.type) {
        return `<i class="fas fa-circle fa-sm now"></i><hr class="now" />`;
    }
    //${event.summary.indexOf('birthday') > 0 ? `<div class="congrats"><i class="fas fa-gift"></i>&nbsp;Send congrats</div>` : ''}
    return `
      <div class="event-wrapper">
        <div class="event">
          <div class="info">
            <div class="summary">${event.summary}</div>
            ${event.location ? `<div class="location"><i class="fas fa-map-marker-alt"></i>&nbsp;${event.location.split(',')[0]}</div>` : ''}
            
          </div>
          <div class="time">${event.start.date ? 'All day' : (moment(event.start.dateTime).format('HH:mm') + `-` + moment(event.end.dateTime).format('HH:mm'))}</div>
        </div>
      </div>`;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define at least one calendar entity via entities');
    }
    this.config = {
      name: 'Calendar',
      ...config
    };
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }

  isSomethingChanged(events) {
    let isSomethingChanged = JSON.stringify(events) !== JSON.stringify(this.events);
    return isSomethingChanged;
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
  }
}

customElements.define('google-calendar-card', GoogleCalendarCard);