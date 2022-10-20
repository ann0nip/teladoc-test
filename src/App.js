import {useEffect, useState} from 'react';
import './App.scss';
import Species from './Species';

const API_URL = 'https://swapi.dev/api/films/2/';
const SPECIES_IMAGES = {
  droid:
    'https://static.wikia.nocookie.net/starwars/images/f/fb/Droid_Trio_TLJ_alt.png',
  human:
    'https://static.wikia.nocookie.net/starwars/images/3/3f/HumansInTheResistance-TROS.jpg',
  trandoshan:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Bossk_full_body.png',
  wookie:
    'https://static.wikia.nocookie.net/starwars/images/1/1e/Chewbacca-Fathead.png',
  yoda: 'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png',
};
const CM_TO_IN_CONVERSION_RATIO = 2.54;

function App() {
  const [speciesURIs, setSpeciesURIs] = useState([]);
  const [species, setSpecies] = useState([]);

  const getImageBySpecieName = specieName => {
    /**
     * To be more accurate,
     * maybe it is better to create a regex to check if the specieName matches with a key of SPECIES_IMAGES;
     * but I decided to go for a simplest possible solution. */
    const defaultSpecie = 'yoda';
    return SPECIES_IMAGES[specieName] || SPECIES_IMAGES[defaultSpecie];
  };

  const getSpecieHeight = average_height => {
    const height = (average_height / CM_TO_IN_CONVERSION_RATIO).toFixed();
    return isNaN(height) ? 'N/A' : `${height}"`;
  };

  useEffect(() => {
    const getSpeciesURIs = async () => {
      try {
        const res = await fetch(API_URL);
        const {species: URIs} = await res.json();
        setSpeciesURIs(URIs);
      } catch (error) {
        console.log(error);
      }
    };

    getSpeciesURIs();
  }, []);

  useEffect(() => {
    const getSpecies = async () => {
      try {
        const speciesData = await Promise.all(
          speciesURIs.map(async URI => {
            const res = await fetch(URI);
            return res.json();
          })
        );
        const species = speciesData.map(specie => ({
          ...specie,
          height: getSpecieHeight(specie.average_height),
          image: getImageBySpecieName(specie.name.toLowerCase()),
          numFilms: specie.films.length,
        }));
        setSpecies(species);
      } catch (error) {
        console.log(error);
      }
    };

    getSpecies();
  }, [speciesURIs]);

  return (
    <div className="App">
      <h1>Empire Strikes Back - Species Listing</h1>
      <div className="App-species">
        {species.map(specie => (
          <Species key={specie.created} {...specie} />
        ))}
      </div>
    </div>
  );
}

export default App;
