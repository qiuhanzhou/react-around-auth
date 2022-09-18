import { useState } from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom'
import * as auth from '../utils/auth'
import Header from './Header'
import InfoTooltip from './InfoTooltip'
import successIcon from '../images/success.svg'
import failIcon from '../images/fail.svg'

function Register({}) {
  const [signinCredentials, setSigninCredentials] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')
  const [iconSrc, setIconSrc] = useState('')
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)

  const { email, password } = signinCredentials

  let history = useHistory()

  function handleChange(e) {
    const { name, value } = e.target
    console.log(name, value)
    setSigninCredentials({ ...signinCredentials, [name]: value })
  }

  function showFailedModal() {
    setMessage('Oops, something went wrong! Please try again.')
    setIconSrc(failIcon)
    setIsInfoTooltipOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (email && password) {
      auth
        .register(password, email)
        .then((res) => {
          console.log(res)
          if (res.data) {
            //show modal with success message
            setIsInfoTooltipOpen(true)
            setMessage('Success! You have now been registered.')
            setIconSrc(successIcon)
            // history.push('/login')
          } else {
            //show modal with failure message
            showFailedModal()
          }
        })
        .catch((err) => {
          showFailedModal()
          if (err.statusCode === 400) {
            console.log('one of the fields was filled in incorrectly')
          } else {
            console.log(err)
          }
        })
    }
  }

  function handleClose(e) {
    if (
      (e.type === 'click' &&
        (e.target.classList.contains('modal__close-button') ||
          e.target.classList.contains('modal_open'))) ||
      (e.type === 'keydown' && e.key === 'Escape')
    ) {
      setIsInfoTooltipOpen(false)
    }
  }

  return (
    <div className='auth'>
      <Header email='' text='Sign up' />
      <form onSubmit={handleSubmit} className='auth__form'>
        <h2 className='auth__form_title'>Sign up</h2>
        <input
          className='auth__form_input'
          required
          placeholder='email'
          id='email'
          name='email'
          type='email'
          value={email}
          onChange={handleChange}
        />
        <input
          required
          className='auth__form_input'
          placeholder='password'
          id='password'
          name='password'
          type='password'
          value={password}
          onChange={handleChange}
        />
        <div className='auth__button-container'>
          <button type='submit' className='auth__button'>
            Sign up{' '}
          </button>
        </div>
      </form>

      <div className='auth__redirect'>
        <p>
          Already a member? Log in{' '}
          <Link to='/signin' className='auth__redirect_link'>
            here!
          </Link>
        </p>
      </div>
      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={handleClose}
        message={message}
        iconSrc={iconSrc}
      />
    </div>
  )
}

export default withRouter(Register)
