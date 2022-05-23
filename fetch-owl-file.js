const axios = require('axios');
const fs = require('fs')
const path = require('path')

const OWL_FILE_PATH = path.join('src', 'data', 'ontology.owl')
const OWL_URL = 'http://purl.org/neurobridges/ontology.owl';

(async () => {
  try {
    const { data } = await axios.get(OWL_URL)
    if (!data) {
      throw new Error('An error occured while fetching OWL file.')
    }
    fs.writeFileSync(OWL_FILE_PATH, data, 'utf8')
  } catch (error) {
    console.error(error.message)
  }
})();

