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

