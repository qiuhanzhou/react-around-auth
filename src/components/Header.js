import logo from '../images/logo.svg'
import { useHistory } from 'react-router-dom'

export default function Header({ email, text, loggedIn }) {
  let history = useHistory()

  function onSignOut() {
    console.log('onSignOut ran')
    localStorage.removeItem('jwt')
    history.push('/signin')
    // window.location.reload()
  }
  return (
    <header className='header'>
      <img src={logo} alt='logo' className='header__logo' />
      <div className='header__user'>
        <div className='header__email '>{email}</div>

        {loggedIn && (
          <button className='header__button' type='submit' onClick={onSignOut}>
            {text}
          </button>
        )}

        {!loggedIn && <div className='header__text'>{text}</div>}
      </div>
    </header>
  )
}
