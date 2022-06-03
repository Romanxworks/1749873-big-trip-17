import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {CITIES, TYPES} from '../mock/const.js';
import {pointDateAddEdit} from '../utils/date-utils.js';

const BLANK_POINT = {
  basePrice: 100,
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: {
    description: ' ',
    name: ' ',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: ' '
      }
    ]
  },
  type: 'taxi',
  offers: []
};

const destinationNameTemplate = (name) => `<option value="${name}"></option>`;
const destinationName = () => CITIES.map((name) => destinationNameTemplate(name)).join('');

const pictureTemplate = (src) => `<img class="event__photo" src="${src}" alt="Event photo">`;
const picturesTemplate = (pictures) => pictures.map((picture)=>pictureTemplate(picture.src)).join('');
const destinationTemplate = (destination) =>(`<section class="event__section  event__section--destination">
<h3 class="event__section-title  event__section-title--destination">Destination</h3>
<p class="event__destination-description">${destination.description}</p>

<div class="event__photos-container">
  <div class="event__photos-tape">
  ${picturesTemplate(destination.pictures)}
  </div>
</div>
</section>`);

const typeListTempalte = (type, pointType) => {
  if(type === pointType){
    return (`<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" checked>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase()+type.slice(1)}</label>
  </div>`);
  }else {
    return (`<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase()+type.slice(1)}</label>
  </div>`);
  }
} ;
const createTypeList = (pointType) => TYPES.map((type)=>typeListTempalte(type, pointType)).join('');

const offerElementTemplate = (offer, offerPoint) => {
  const offreLabel = ((offer.title).split(' ')[0]).toLowerCase();

  if(offerPoint.includes(offer.id)){
    return (`<div class="event__offer-selector">
       <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offreLabel}" type="checkbox" name="event-offer-${offreLabel}" checked>
        <label class="event__offer-label" for="event-offer-${offreLabel}">
        <span class="event__offer-title">${offer.title}</span>
         &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
        </label>
    </div>`
    );}else{
    return (`<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offreLabel}" type="checkbox" name="event-offer-${offreLabel}">
       <label class="event__offer-label" for="event-offer-${offreLabel}">
       <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
       <span class="event__offer-price">${offer.price}</span>
       </label>
   </div>`
    );
  }};

const getPointTypeOffer = (offers, pointType) => {
  const pointTypeOffer = offers.find((offer) =>offer.type === pointType);
  return pointTypeOffer? pointTypeOffer : null;
};
const getDestinationByPoint = (destinations, stateDestination) => {
  const destinationByPoint = destinations.find((destination) => destination.name === stateDestination.name);
  return destinationByPoint;
};
const createAddEditPointTemplate = (point, offers = [], destinations= []) => {
  const {basePrice,
    dateFrom,
    dateTo,
    stateDestination,
    stateType,
    offers: offersPoint,
  } = point;

  const destinationByPoint = getDestinationByPoint(destinations,stateDestination);
  const destinationByPointTemplate = destinationTemplate(destinationByPoint);
  const pointTypeOffer = getPointTypeOffer(offers, stateType);
  const createPointOffer = (offerPoint) => pointTypeOffer ? pointTypeOffer.offers.map((offer)=>offerElementTemplate(offer, offerPoint)).join(''): '';
  const pointOffers = createPointOffer(offersPoint);
  const typeList =  createTypeList(stateType);
  const destinationList = destinationName();
  const pointDateFrom = pointDateAddEdit(dateFrom);
  const pointDateTo = pointDateAddEdit(dateTo);

  return (`<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${stateType}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${typeList}                   
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                    ${stateType}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${stateDestination.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${destinationList}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${pointDateFrom}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${pointDateTo}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">${stateDestination.name === '' ? 'Delete' : 'Cancel'}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
               
                <section class="event__section  event__section--offers ${offersPoint === null|| pointTypeOffer=== null? 'visually-hidden':''}">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${pointOffers}
                  </section>
                  ${destinationByPointTemplate}
                  
                </section>
              </form>
            </li>`
  );};


export default class AddEditPoint extends AbstractStatefulView{
  #destinations = null;
  #offer = null;

  constructor(point = BLANK_POINT, offers, destinations){
    super();
    this.#offer = offers;
    this.#destinations = destinations;
    this._state = AddEditPoint.parsePointToState(point);
    this.#setInnerHandlers();
  }

  get template() {
    return createAddEditPointTemplate(this._state, this.#offer, this.#destinations);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setEditClickHandler(this._callback.click);
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  setEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(AddEditPoint.parseStateToPoint(this._state));
  };

  #typeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      stateType: evt.target.value
    });
  };

  #destinationNameToggleHandler = (evt) => {
    evt.preventDefault();
    this._state.stateDestination.name= evt.target.value;
    this.updateElement( {stateDestination:this._state.stateDestination});
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeToggleHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationNameToggleHandler);
  };

  static parsePointToState = (point) => ({...point,
    stateDestination: point.destination,
    stateType: point.type
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    point.type = point.stateType;
    point.destination = point.stateDestination;

    if(!point.stateDestination){
      point.destination = {
        description: '',
        name: '',
        pictures: [
          {
            src: 'http://picsum.photos/300/200?r=0.0762563005163317',
            description: ''
          }
        ]
      };
    }
    if(!point.stateType){
      point.type = 'taxi';
    }

    delete point.stateDestination;
    delete point.stateType;

    return point;
  };
}

