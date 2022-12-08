const axios = require('axios');
const fs = require('fs');
const path = require('path');

//

const OWL_URL = 'https://purl.org/neurobridges/ontology.owl';
const OWL_FILE_PATH = path.join(__dirname, 'src', 'data', `ontology.owl`)

const fetchOwlFile = async () => {
  try {
    const { data } = await axios.get(OWL_URL);
    if (!data) {
      throw new Error('An error occurred while retrieving ontology.');
    }
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

//

/*
  fetch the new OWL file,
  replace ./src/data/ontology.owl wth response from OWL_URL.
*/
(async () => {
  console.log('fetching...')
  const owl = await fetchOwlFile()
  // bail out if owl file contains no data.
  if (!owl.length) {
    return
  }
  console.log('received...')
  // write the new file contents
  fs.writeFileSync(OWL_FILE_PATH, owl, { encoding: 'utf8' })
  console.log(`${ OWL_FILE_PATH } successfully updated!`)
})();
