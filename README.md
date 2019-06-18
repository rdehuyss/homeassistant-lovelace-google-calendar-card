# Deprecated
This repo is deprecated. I'm sad to say that I do not have the time to maintain this. However, there are very good alternatives now available:
- https://github.com/ljmerza/calendar-card
- https://github.com/atomic7777/atomic_calendar

# Calendar Card for Home Assistant
![](https://i.imgur.com/egQofZM.png "Layout")

## Updates
* 2019-06-10: not long developped.
* 2018-08-18: major rewrite, see updated installation instructions
* 2018-08-14: Correct use of hass.callApi to support new Authentication System, multi-locale and theming support, added caching
* 2018-08-11: First release

### Track Updates
This custom card can be tracked with the help of [custom-updater](https://github.com/custom-components/custom_updater).

In your configuration.yaml

```
custom_updater:
  card_urls:
    - https://raw.githubusercontent.com/rdehuyss/homeassistant-lovelace-google-calendar-card/master/custom_updater.json
```

## Usage
### Prerequisites
You should have setup Google calendar integration or Caldav integration in HomeAssistant.

## Options

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:calendar-card`
| showProgressBar | boolean | **Optional** | `true` Option to show the progress bar
| numberOfDays | number | **Optional** | `7` Number of days to display from calendars
| entities | object | **Required** | List of calendars to display

### Configuration
In your ui-lovelace.yaml

```
resources:
  - url: https://unpkg.com/moment@2.22.2/moment.js
    type: js
  - url: /local/custom_ui/calendar-card/calendar-card.js?v=1.0.1
    type: module
...

- type: "custom:calendar-card"
      entities:
        - calendar.ronald_dehuysser
        - calendar.contacts

- type: "custom:calendar-card"
      name: "Birthdays"
      showProgressBar: false
      numberOfDays: 14
      entities:
        - calendar.contacts
```

### You want more than 5 Google events?
```
mkdir /config/custom_components/calendar
cd /config/custom_components/calendar
wget https://raw.githubusercontent.com/home-assistant/home-assistant/dev/homeassistant/components/calendar/google.py
```
Use a text editor to change the `'maxResults': 5` in `google.py` to a number of your liking.
