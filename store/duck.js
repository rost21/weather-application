import { createAction, handleActions } from 'redux-actions';
import { call, put,select, takeLatest, takeEvery, delay } from 'redux-saga/effects';
import { client_id, client_secret } from '../api/weather'; 

const FETCH_FORECAST = 'FETCH_FORECAST';
const FETCH_FORECAST_NOW_SUCCESS = 'FETCH_FORECAST_NOW_SUCCESS';
const FETCH_FORECAST_WEEK_SUCCESS = 'FETCH_FORECAST_WEEK_SUCCESS';
const FETCH_FORECAST_HOUR_SUCCESS = 'FETCH_FORECAST_HOUR_SUCCESS';
const FETCH_CITIES_SEARCH = 'FETCH_CITIES_SEARCH';
const FETCH_CITIES_SUCCESS = 'FETCH_CITIES_SUCCESS';
const SEARCH = 'SEARCH';
const CLEAN = 'CLEAN';

export const actions = {
    fetchForecast: createAction(FETCH_FORECAST),
    fetchForecastNowSuccess: createAction(FETCH_FORECAST_NOW_SUCCESS),
    fetchForecastWeekSuccess: createAction(FETCH_FORECAST_WEEK_SUCCESS),
    fetchForecastHourSuccess: createAction(FETCH_FORECAST_HOUR_SUCCESS),
    fetchCitiesSearch: createAction(FETCH_CITIES_SEARCH),
    fetchCitiesSuccess: createAction(FETCH_CITIES_SUCCESS),
    search: createAction(SEARCH),

    clean: createAction(CLEAN),
};

export const initialState = {
    forecastNow: [],
    successforecastNow: false,
    forecastWeek: [],
    successforecastWeek: false,
    forecastHour: [],
    successforecastHour: false,
    cities: [],
    search: '',
};

export const reducer = handleActions({

    [SEARCH]: (state, action) => {
        return { ...state, search: action.payload }
    },

    [FETCH_FORECAST_NOW_SUCCESS]: (state, action) => {
        return { ...state, forecastNow: action.payload, successforecastNow: true, }
    },

    [FETCH_FORECAST_WEEK_SUCCESS]: (state, action) => {
        return { ...state, forecastWeek: action.payload, successforecastWeek: true, }
    },

    [FETCH_FORECAST_HOUR_SUCCESS]: (state, action) => {
        return { ...state, forecastHour: action.payload, successforecastHour: true, }
    },

    [FETCH_CITIES_SUCCESS]: (state, action) => {
        return { ...state, cities: action.payload }
    },

    [CLEAN]: () => initialState,

}, initialState);

function* fetchCities(action) {
    const rawData = yield call(getCities, action.payload);
    const data = rawData.map(i => i.place);
    const cities = data.map(d => d.name);
    //console.log(data);
    yield put(actions.fetchCitiesSuccess(data));
}

function getCities(city) {

    const url = `https://api.aerisapi.com/places/search?limit=5&query=name:^${city}&client_id=${client_id}&client_secret=${client_secret}`;
    
        return fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                if (!json.success) {
                    console.log('Oh no!')
                } else {
                    return json.response;
                }
            });
}

function* fetchForecast(){
    const city = yield select(state => state.search);
    const dataNow = yield call(getForecastNow, city);
    const dataWeek = yield call(getForecastWeek, city);
    const dataHour = yield call(getForecastHourly, city);

    yield put(actions.fetchForecastNowSuccess(dataNow.ob));
    yield put(actions.fetchForecastWeekSuccess(dataWeek[0].periods));
    yield put(actions.fetchForecastHourSuccess(dataHour[0].periods));
}

function getForecastNow(city) {
    const url = `https://api.aerisapi.com/observations/${city}?&format=json&filter=allstations&limit=1&client_id=${client_id}&client_secret=${client_secret}`;

    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (!json.success) {
                console.log('Oh no!');
            } else {
               return json.response;
            }
        });
}

function getForecastWeek(city) {
    const url = `https://api.aerisapi.com/forecasts/${city}?&format=json&filter=day&limit=7&client_id=${client_id}&client_secret=${client_secret}`;

    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (!json.success) {
                console.log('Oh no!');
            } else {
               return json.response;
            }
        });
}

function getForecastHourly(city) {
    const url = `https://api.aerisapi.com/forecasts/${city}?&format=json&filter=1hr&limit=24&client_id=${client_id}&client_secret=${client_secret}`;

    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            if (!json.success) {
                console.log('Oh no!');
            } else {
               return json.response;
            }
        });
}

export function* saga() {
    yield takeLatest(FETCH_FORECAST, fetchForecast);
    yield takeLatest(FETCH_CITIES_SEARCH, fetchCities);
}