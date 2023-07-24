import { createContext, useContext, useState } from "react"
import PropTypes from 'prop-types'

const PublicationTrayContext = createContext({});
export const usePublicationTray = () => useContext(PublicationTrayContext);

export const PublicationTrayProvider = ({ children }) => {
  const [studyTabs, setStudyTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [expandedAccordions, setExpandedAccordions] = useState(new Set());

  const handleRowClick = ({ row }) => {
    // if this row is already open in the tabs, set the active tab to it and do nothing
    if(studyTabs.find((tab) => tab.study.pmid === row.pmid)) {
      setActiveTab(row.pmid);
      return;
    }

    // if there is a tab which is not pinned, use that tab for the new study
    const unpinnedIndex = studyTabs.findIndex(tab => !tab.pinned);
    if(unpinnedIndex !== -1) {
      setStudyTabs(prev => {
        const next = prev.slice();
        next[unpinnedIndex] = {
          study: row,
          pinned: false,
        }
        return next;
      })
    }
    // if the clicked row is not in the tab list, add it
    else if(!studyTabs.find(tab => tab.study.pmid === row.pmid)) {
      setStudyTabs(prev => [...prev, { study: row, pinned: false }]);
    }

    setActiveTab(row.pmid);
  };

  const handleRowDoubleClick = ({ row }) => {
    // if the tab is double clicked, we want to pin it so it is in the list 
    // until explicitly closed
    setStudyTabs((prev) => {
      const clickedTabIndex = prev.findIndex(tab => tab.study.pmid === row.pmid);
      if(clickedTabIndex === -1) return;
      const next = prev.slice();
      next[clickedTabIndex].pinned = true;
      return next;
    })
  }
  
  return (
    <PublicationTrayContext.Provider value={{
      studyTabs, setStudyTabs,
      activeTab, setActiveTab,
      expandedAccordions, setExpandedAccordions,
      handleRowClick,
      handleRowDoubleClick,
    }}>
      {children}
    </PublicationTrayContext.Provider>
  )
}

PublicationTrayProvider.propTypes = {
  children: PropTypes.node,
}