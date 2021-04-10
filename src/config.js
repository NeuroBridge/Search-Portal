export const config = {
  tables: [
    {
      id: 'subjects',
      name: 'Subjects/demographics',
      criteria: [
        { id: 'minimum-age', name: 'Minimum Age', },
        { id: 'maximum-age', name: 'Maximum Age', },
        { id: 'sex', name: 'Sex', },
        { id: 'diagnosis', name: 'Diagnosis (DSM-IV)', },
      ],
    },{
      id: 'diagnosis',
      name: 'Diagnosis',
      criteria: [
        { id: 'minimum-age', name: 'Minimum Age', },
        { id: 'sex', name: 'Sex', },
        { id: 'diagnosis', name: 'Diagnosis (DSM-IV)', },
      ],
    },{
      id: 'imaging-data-type',
      name: 'Imaging data type',
      criteria: [
        { id: 'minimum-age', name: 'Minimum Age', },
        { id: 'maximum-age', name: 'Maximum Age', },
        { id: 'diagnosis', name: 'Diagnosis (DSM-IV)', },
      ],
    },{
      id: 'cognitive-assessments',
      name: 'Cognitive assessments',
      criteria: [
        { id: 'minimum-age', name: 'Minimum Age', },
        { id: 'maximum-age', name: 'Maximum Age', },
        { id: 'sex', name: 'Sex', },
      ],
    },{
      id: 'clinical-assessments',
      name: 'Clinical assessments',
      criteria: [
        { id: 'minimum-age', name: 'Minimum Age', },
        { id: 'maximum-age', name: 'Maximum Age', },
        { id: 'sex', name: 'Sex', },
        { id: 'diagnosis', name: 'Diagnosis (DSM-IV)', },
      ],
    },
  ],
}
