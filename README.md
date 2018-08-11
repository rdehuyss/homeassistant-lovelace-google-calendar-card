# Calendar Card for Home Assistant
(https://i.imgur.com/egQofZM.png "Layout")

## Usage
### Prerequisites
You should have setup the google calendar integration.

### Configuration
In your ui-lovelace.yaml

```
resources:
  - url: /local/dist/google-calendar-card.js
    type: module
  - url: https://use.fontawesome.com/releases/v5.2.0/css/all.css
    type: css
...

- type: "custom:google-calendar-card"
      entities: 
        - calendar.ronald_dehuysser
        - calendar.contacts
```

### You want more than 5 events?
Using docker-compose and sed change the `'maxResults': 5` in `/homeassistant/components/calendar/google.py` to a number of your liking.