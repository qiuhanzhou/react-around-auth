import { useEffect } from 'react'

export default function PopupWithForm(props) {
  useEffect(() => {
    if (props.isOpen) {
      const modal = document.querySelector(`.modal_type_${props.name}`)
      modal.focus()
    }
  }, [props.isOpen, props.name])
  return (
    <div
      className={`modal modal_type_${props.name} ${
        props.isOpen ? 'modal_open' : ''
      } 
      `}
      id={`${props.name}-modal`}
      onClick={props.onClose}
      onKeyDown={props.onClose}
      tabIndex='0'
    >
      <div className='modal__content'>
        <button
          type='button'
          aria-label='close'
          className='modal__close-button'
        ></button>
        <h2 className='modal__title'>{props.title}</h2>
        <form className='modal__form' name={props.name} id={props.name}>
          {props.children}
          <button
            type='submit'
            aria-label='submit'
            className='modal__submit-button'
          >
            {props.buttonText}
          </button>
        </form>
      </div>
    </div>
  )
}
