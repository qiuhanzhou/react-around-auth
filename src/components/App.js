import { useEffect, useState } from 'react'
import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import ImagePopup from './ImagePopup'
import InfoTooltip from './InfoTooltip'

import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import api from '../utils/api'
import { CurrentUserContext } from '../../src/contexts/CurrentUserContext'
import Login from './Login'
import Register from './Register'
import ProtectedRoute from './ProtectedRoute'
import * as auth from '../utils/auth'
import successIcon from '../images/success.svg'
import failIcon from '../images/fail.svg'

function App() {
  const history = useHistory()

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [cards, setCards] = useState([])
  const [selectedCard, setSelectedCard] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [iconSrc, setIconSrc] = useState('')

  useEffect(() => {
    api
      .getInitialCards()
      .then((values) => {
        setCards(values)
      })
      .catch((err) => {
        console.log(`can't get inital cards: ${err}`)
      })
  }, [])

  useEffect(() => {
    api
      .getUserInfo()
      .then((currentUser) => {
        console.log(currentUser)
        setCurrentUser(currentUser)
      })
      .catch((err) => {
        console.log(`can't get inital user info: ${err}`)
      })
  }, [])

  useEffect(handleTokenCheck, [])

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((user) => user._id === currentUser._id)

    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then(
        //api returns the new liked/unliked card object
        (newCard) => {
          console.log(newCard)
          setCards(
            // pass in a function to reliably get the value of the current state
            (state) =>
              state.map((currentCard) =>
                currentCard._id === card._id ? newCard : currentCard,
              ),
          )
        },
      )
      .catch((err) => {
        console.log(`can't chage like card status: ${err}`)
      })
  }

  function handleCardDelete(card) {
    // Send a request to the API and getting the updated card data
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id),
        )
      })
      .catch((err) => {
        console.log(`can't delete card: ${err}`)
      })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsImagePopupOpen(false)
    setIsInfoTooltipOpen(false)
    setSelectedCard({})
  }

  function handleCardClick(card) {
    setSelectedCard(card)
    setIsImagePopupOpen(true)
  }

  function handleCloseAllPopups(e) {
    if (
      (e.type === 'click' &&
        (e.target.classList.contains('modal__close-button') ||
          e.target.classList.contains('modal_open'))) ||
      (e.type === 'keydown' && e.key === 'Escape')
    ) {
      closeAllPopups()
    }
  }

  function handleUpdateUser(newUserInfo) {
    setIsLoading(true)
    api
      .setUserInfo(newUserInfo)
      .then((newUserInfo) => {
        //update currentUser state from received  modified profile data
        setCurrentUser(newUserInfo)
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`can't set user info: ${err}`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true)
    api
      .setUserAvatar({ avatar })
      .then(
        //api returns the updated current user info
        //update currentUser state from received  modified profile data
        (newUserInfo) => {
          setCurrentUser(newUserInfo)
          closeAllPopups()
        },
      )
      .catch((err) => {
        console.log(`can't update user avatar: ${err}`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleAddPlaceSubmit(newAddPlaceInfo) {
    setIsLoading(true)
    // Send a request to the API and getting the updated card data
    api
      .addCard(newAddPlaceInfo)
      .then(
        //api request returns a response with the obj of the new card
        (newCard) => {
          setCards([newCard, ...cards])
          closeAllPopups()
        },
      )
      .catch((err) => {
        console.log(`can't add card: ${err}`)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleTokenCheck() {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt')
      // we're checking the user's token
      auth
        .checkToken(jwt)
        .then((res) => {
          console.log('checkToken: ', res)
          setEmail(res.data.email)
          if (res.data) {
            setLoggedIn(true)
            history.push('/')
          }
        })
        .catch((err) => {
          console.log('cannot check token')
        })
    }
  }

  function onLogin(email) {
    // handleTokenCheck()
    setEmail(email)
    setLoggedIn(true)
  }

  function showFailedModal() {
    setMessage('Oops, something went wrong! Please try again.')
    setIconSrc(failIcon)
    setIsInfoTooltipOpen(true)
  }
  function handleRegisterSubmit(password, email) {
    console.log('ran')
    console.log(password, email)

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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='App'>
        <Switch>
          <Route path='/signup'>
            <Register
              onClose={handleCloseAllPopups}
              isInfoTooltipOpen={isInfoTooltipOpen}
              setIsInfoTooltipOpen={setIsInfoTooltipOpen}
              handleOnRegisterSubmit={handleRegisterSubmit}
            />
            <InfoTooltip
              isOpen={isInfoTooltipOpen}
              onClose={handleCloseAllPopups}
              message={message}
              iconSrc={iconSrc}
            />
          </Route>
          <Route path='/signin'>
            <Login handleLogin={onLogin} />
          </Route>
          <ProtectedRoute path='/' loggedIn={loggedIn}>
            <div className='page'>
              <Header email={email} buttonText='Log Out' loggedIn={loggedIn} />
              <Main
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onEditAvatarClick={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
              <Footer />

              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={handleCloseAllPopups}
                onUpdateUser={handleUpdateUser}
                isLoading={isLoading}
              />

              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={handleCloseAllPopups}
                onAddPlaceSubmit={handleAddPlaceSubmit}
                isLoading={isLoading}
              />

              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={handleCloseAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
                isLoading={isLoading}
              />

              <ImagePopup
                isOpen={isImagePopupOpen}
                onClose={handleCloseAllPopups}
                card={selectedCard}
              />
            </div>
          </ProtectedRoute>
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default withRouter(App)
