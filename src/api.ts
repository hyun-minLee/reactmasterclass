const API_KEY = "d1136fa354cac7b216f876b9083f7b3e";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

interface IKnown {
  id: number;
  backdrop_path: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
}

interface IPerson {
  id: number;
  known_for_department: string;
  name: string;
  profile_path: string;
  known_for: IKnown[];
  overview: string;
}

export interface IGetPersonResult {
  page: number;
  results: IPerson[];
  total_pages: number;
  total_results: number;
}

interface IOnAirTV {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  popularity: number;
  overview: string;
  first_air_date: string;
}

interface ITopRateTV {
  backdrop_path: string;
  id: number;
  name: string;
  popularity: number;
  poster_path: string;
  vote_average: string;
  overview: string;
}

interface ITopRateMovies {
  backdrop_path: string;
  id: number;
  title: string;
  popularity: number;
  poster_path: string;
  vote_average: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetOnAirTVResult {
  page: number;
  results: IOnAirTV[];
  total_pages: number;
  total_results: number;
}

export interface IGetTopRateMoviesResult {
  page: number;
  results: ITopRateMovies[];
  total_pages: number;
  total_results: number;
}

export interface IGetTopRateTVResult {
  page: number;
  results: ITopRateTV[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getOnAirTV() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRateTV() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRateMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getSearch(search: string) {
  return fetch(
    `${BASE_PATH}/search/keyword?api_key=${API_KEY}&query=${search}`
  ).then((response) => response.json());
}

export function getSearchMovies(search: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${search}`
  ).then((response) => response.json());
}

export function getSearchTV(search: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${search}`
  ).then((response) => response.json());
}

export function getSearchPerson(search: string) {
  return fetch(
    `${BASE_PATH}/search/person?api_key=${API_KEY}&query=${search}`
  ).then((response) => response.json());
}
