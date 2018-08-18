# Calendar Card for Home Assistant
![](https://i.imgur.com/egQofZM.png "Layout")

## Updates
* 2018-08-18: major rewrite, see updated installation instructions
* 2018-08-14: Correct use of hass.callApi to support new Authentication System, multi-locale and theming support, added caching
* 2018-08-11: First release

## Usage
### Prerequisites
You should have setup Google calendar integration or Caldav integration in HomeAssistant.

### Configuration
In your ui-lovelace.yaml

```
resources:
  - url: https://unpkg.com/moment@2.22.2/moment.js
    type: js
  - url: /local/calendar-card.js
    type: module
...

- type: "custom:calendar-card"
      entities: 
        - calendar.ronald_dehuysser
        - calendar.contacts

- type: "custom:calendar-card"
      name: "Birthdays"
      showProgressBar: false
      entities: 
        - calendar.contacts
```

### You want more than 5 Google events?
Using docker-compose and sed change the `'maxResults': 5` in `/homeassistant/components/calendar/google.py` to a number of your liking.