# starwarsguide
Simple JS app that demonstrate MVP

This app consumes Star Wars API/SWAPI (https://swapi.co/)

The app has several sections: films, people, vehicles, etc (as per all available resource in SWAPI) 

Built using simple MVP pattern. Each section has its own MVP triad (eg: films has view, model, presenter), all shared the same M,V,P 'classes'
There's also app presenter that act as parent presenter/hub

## How it works:
Model communicate with SWAPI. It fetch data and store it within model's data object. So it doesn't need to perform API calls again when data already exists in model.
The API call process also implement very simple cache.. (not saved to local storage, though).

View is dealing with rendering UI and catch input/events. The view communicate with presenter.

The view here is a passive view variant, so it doesn't deal with model. Presenter communicate with model and tell view to update itself.

### Helper libraries:
- [Zepto](http://zeptojs.com/) (jQuery like library, just smaller). Used in view to simplify dom manipulation. It also used in model as helper for ajax.
- [Mustache](https://github.com/janl/mustache.js), used in view for templating
- [Director](https://github.com/flatiron/director), a routing library.
