'use strict';


class workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;  // [lat, lng]
    this.distance = distance;  //in km
    this.duration = duration;  // in min 
  } 
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
       'September', 'October', 'November', 'December'];

       this._description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} 
       ${this.date.getDate()}`;
  }
  click() {
    this.click++;
  }
}

class running extends workout{
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }


   calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace
   }
}



class Cycling extends workout{
  type = 'cycling';

  constructor(coords, distance, duration,elevationGain) {
  super(coords, distance, duration);
  this.elevationGain = elevationGain;
  this.calcSpeed();
  this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}


// const run1 = new running([39, -12], 5.2, 24, 178)
// const cycling1 = new Cycling([39, -12], 27, 95, 523)
// console.log(run1, cycling1);

/////////////////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    
    this._getPosition();


    this._getLocalstorage();

    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

    _getPosition() {
      if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
       function() {
        alert('could not get your position');
        }
      );
    }

  _loadMap(position) {
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude]

   this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    // console.log(map);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: 
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

   

    //handlich click on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
        });
  }

  _showForm(mapE) {
     this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value = inputDuration.value  = inputCadence.value  = inputElevation.value  = '';

    form.Style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.Style.display = 'grid'), 1000);
  }


  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');}

  _newWorkout (e) {
    const validInput = (...input) => 
      input.every(inp => Number.isFinite(inp));
    const allpositive = (...inputs) => inputs.every(inp => inp > 0);
    
    e.preventDefault();

    //get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDistance.value;
    const { lat , lng} = this.#mapEvent.latlng;
    let workout;

    // if workout running, create running object
    if(type === ' running') {
       const cadence = +inputCadence.value;

      // check if data is valid
      if(
         !validInput(distance, duration, cadence) || 
         !allpositive(distance, duration, cadence)
      )
       return alert('input have to be positive number!');
       workout = new running([lat, lng], distance, duration,cadence);
       }

    // if workout cycling, create cycling object
    if(type === 'cycling') {
      const elevation= +inputElevation.value;

     if(
      !validInput(distance, duration, elevation) ||
      !allpositive(distance, duration)
    )
    return alert('input have to be positive number!');

    workout = new Cycling([lat, lng], distance, duration,elevation);
 }

    // and new object to workout array
    this.#workouts.push(workout);

    // render workout on map as marker
    this._renderWorkoutMarker(workout);

    // render workout on list
  this._renderWorkout(workout);
     
    //hide form + clear input fields
   this._hideForm();
 

 //set local storage to all workouts
   this._setlocalstorage();
}

 _renderWorkoutMarker(workout) {
  L.marker(workout.coords)
  .addTo(this.#map)
  .bindPopup(
  L.Popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      classname: '${workout.type}-popup',
    })
   )  
   .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : ' 🚴‍♂️'} ${workout._description}`)
  .openPopup();
  }

  _renderWorkout(workout) {
     const html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">&{workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'}
            </span>;
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

          if(workout,type === 'running')
             html += `
           <div class="workout__details">
          <span class="workout__icon">⚡️</span>
           <span class="workout__value">${workout.pace.toFixedD(1)}</span>
          <span class="workout__unit">min/km</span>
           </div>
           <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
           <span class="workout__unit">spm</span>
         </div>
      </li>
      `;

      if(workout.type === 'cycling')
        html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">{workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
           </li> -->
      `;
      form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e){

    if(!this.#map) return;

     const workoutEl = e.target.closest('.workout');

     if(!workoutEl) return;


     const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animation: true,
      pan: {
        duration: 1,
      },
    });

    //using the public interface
    // workout.click();
  }

  _setlocalstorage() {
    localStorage.setItem('workout', JSON.stringify(this.#workouts));
  }

  _getLocalstorage() {
    const data = JSON.parse(localStorage.getItem('workout'));

    if(!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => {
      this._renderWorkout(wotk);
    });
  }

  reset() {
    localStorage.removeItem('workout');
    location.reload();
  }
}




  
    
const app = new App();


