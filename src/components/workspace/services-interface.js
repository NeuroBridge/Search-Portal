import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { NeuroQueryInterface } from './neuroquery'

//

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

//

const TabPanel = ({ children, currentIndex, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={ currentIndex !== index }
      id={ `services-tab-${ index }`}
      aria-labelledby={`services-tab-${ index }`}
      { ...other }
    >
      {
        currentIndex === index && (
          <Box sx={{ p: 3 }}>
            <Typography>
              { children }
            </Typography>
          </Box>
        )
      }
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired,
}

//

export const ServicesInterface = () => {
  const [tabIndex, setTabIndex] = useState(0)

  const handleChangeTab = (event, newIndex) => {
    setTabIndex(newIndex)
  }

  return (
    <Box>
      <Tabs value={ tabIndex } onChange={ handleChangeTab }>
        <Tab label="NeuroQuery" { ...a11yProps(0) } />
        <Tab label="TBD" { ...a11yProps(1) } />
      </Tabs>
      <TabPanel key={ `tab-${ 0 }` } currentIndex={ tabIndex } index={ 0 }>
        <NeuroQueryInterface />
      </TabPanel>
      <TabPanel key={ `tab-${ 1 }` } currentIndex={ tabIndex } index={ 1 }>
        Service TBD
      </TabPanel>
    </Box>
  )
}

