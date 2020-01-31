'use strict';

var advertisementsQuantity = 8;

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];

var WIDTH_IMG = 45;
var HEIGHT_IMG = 40;

var mapElement = document.querySelector('.map');
var mapPointsElement = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var cardTemplate  = document.querySelector('#card').content.querySelector('.map__card');

var PIN_LEFT_OFFSET = pinTemplate.offsetWidth / 2;
var PIN_TOP_OFFSET = pinTemplate.offsetHeight;

var MAP_WIDTH = mapPointsElement.offsetWidth;
var MAP_HEIGHT_MIN = 130;
var MAP_HEIGHT_MAX = 630;

var getRandom = function (min, max) {
  var least = Math.ceil(min);
  var most = Math.floor(max);
  return Math.floor(Math.random() * (most - least + 1)) + least;
};

var getRandomArrayElement = function (array) {
  var actual = [];
  var length = getRandom(0, array.length - 1);

  for (var i = 0; i <= length; i++) {
    actual[actual.length] = array[i];
  }

  return actual;
};

var getRandomElement = function (array) {
  return array[getRandom(0, array.length - 1)];
}

var getXLocation = function () {
  return getRandom(1, MAP_WIDTH);
};

var getYLocation = function () {
  return getRandom(MAP_HEIGHT_MIN, MAP_HEIGHT_MAX);
};

var createSingleAdvertisement = function (index) {
  var avatarId = index < 10 ? '0' + index : index;
  var advertisement = {
    author: {
      avatar: 'img/avatars/user' + avatarId + '.png'
    },
    offer: {
      title: 'Заголовок',
      address: '600, 350', // {{location.x}}, {{location.y}}
      price: 1000,
      type: getRandomElement(TYPES),
      rooms: 5,
      guests: 10,
      checkin: getRandomElement(TIMES),
      checkout: getRandomElement(TIMES),
      features: getRandomArrayElement(FEATURES),
      description: 'Описание',
      photos: getRandomArrayElement(PHOTOS)
    },
    location: {
      x: getXLocation(),
      y: getYLocation()
    }
  };
  return advertisement;
};

var createAdvertisementsArray = function (quantity) {
  var actualAdvertisements = [];
  for (var i = 1; i <= quantity; i++) {
    actualAdvertisements[actualAdvertisements.length] = createSingleAdvertisement(i);
  }
  return actualAdvertisements;
};

var advertisements = createAdvertisementsArray(advertisementsQuantity);

mapElement.classList.remove('map--faded');

var renderPin = function (advertisement) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = advertisement.location.x + PIN_LEFT_OFFSET + 'px';
  pinElement.style.top = advertisement.location.y + PIN_TOP_OFFSET + 'px';
  pinElement.querySelector('img').src = advertisement.author.avatar;
  pinElement.querySelector('img').alt = advertisement.offer.title;

  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < advertisements.length; i++) {
  fragment.appendChild(renderPin(advertisements[i]));
}
mapPointsElement.appendChild(fragment);

var renderCard = function (advertisement) {
  var cardElement = cardTemplate.cloneNode(true);

  var advertisementType;

  if (advertisement.offer.type == 'flat') {
    advertisementType = 'Квартира';
  }else if (advertisement.offer.type == 'bungalo') {
    advertisementType = 'Бунгало';
  }else if (advertisement.offer.type == 'house') {
    advertisementType = 'Дом';
  }else if (advertisement.offer.type == 'palace') {
    advertisementType = 'Дворец';
  }

  cardElement.querySelector('.popup__title').textContent = advertisement.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = advertisementType;
  cardElement.querySelector('.popup__text--capacity').textContent = advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до '+ advertisement.offer.checkout;

  cardElement.querySelector('.popup__features').innerHTML = '';
  for (var i = 0; i < advertisement.offer.features.length; i++) {
    var feature = advertisement.offer.features[i];

    var domElementFeature = document.createElement('li');
    domElementFeature.classList.add('popup__feature');
    domElementFeature.classList.add('popup__feature--' + feature);

    cardElement.querySelector('.popup__features').appendChild(domElementFeature);
  }

  cardElement.querySelector('.popup__photos').innerHTML = '';
  for (var i = 0; i < advertisement.offer.photos.length; i++) {
    var photos = advertisement.offer.photos[i];

    var domElementFeature = document.createElement('img');
    domElementFeature.classList.add('popup__photo');
    domElementFeature.src = photos;
    domElementFeature.width = WIDTH_IMG;
    domElementFeature.height = HEIGHT_IMG;

    cardElement.querySelector('.popup__photos').appendChild(domElementFeature);
  }

  cardElement.querySelector('.popup__description').textContent = advertisement.offer.description;
  cardElement.querySelector('.popup__avatar').src = advertisement.author.avatar;

  return cardElement;
};

var card = document.createDocumentFragment();
card.appendChild(renderCard(advertisements[0]));
mapElement.appendChild(card);
