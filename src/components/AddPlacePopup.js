import { useState, useEffect } from 'react'

import PopupWithForm from './PopupWithForm'

export default function AddPlacePopup(props) {
  useEffect(() => {
    setTitle('')
    setLink('')
  }, [props.isOpen])

  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // Pass the latest input value (controlled component) to the external handler
    props.onAddPlaceSubmit({ name: title, link })
  }

  function handleChange(e) {
    if (e.target.name === 'title') {
      setTitle(e.target.value)
    } else {
      setLink(e.target.value)
    }
  }

  return (
    <PopupWithForm
      name='add-card'
      title='New Place'
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText='Create'
      onSubmit={handleSubmit}
    >
      <label className='modal__form-field'>
        <input
          name='title'
          type='text'
          className='modal__input'
          id='title-input'
          placeholder='Title of the new place'
          required
          minLength='1'
          maxLength='30'
          onChange={handleChange}
          value={title}
        />
        <span className='modal__error title-input-error'></span>
      </label>

      <label className='modal__form-field'>
        <input
          name='url'
          type='url'
          className='modal__input'
          placeholder='Image link of the new place'
          id='url-input'
          required
          onChange={handleChange}
          value={link}
        />
        <span className='modal__error url-input-error'></span>
      </label>
    </PopupWithForm>
  )
}
