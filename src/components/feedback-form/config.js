import * as yup from 'yup'

//

export const FORM_URL = `https://script.google.com/macros/s/AKfycbxoBRfiBVMGH7UjAEGS7Tu8QzSQCWHn9R_bknZNy8Ynu5UO6fSJrhT--nROncLFW3be/exec`

//

export const subjectOptions = [
  { value: 'question', displayText: 'I have a question' },
  { value: 'suggestion', displayText: 'I have a suggestion' },
  { value: 'bug', displayText: 'I found a bug!' },
  { value: 'other', displayText: 'Other' },
]

//

export const schema = yup.object().shape({
  name: yup
    .string()
    .required('Please enter your name.'),
  email: yup
    .string()
    .email('Invalid email format'),
  subject: yup
    .string()
    .oneOf(subjectOptions.map(option => option.value))
    .required('Please select the most applicable subject.'),
  message: yup
    .string()
    .required('Please enter a message.'),
})

//

export const defaults = {
  name: '',
  email: '',
  subject: '',
  message: '',
}