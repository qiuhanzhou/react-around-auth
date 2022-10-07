class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl
    this._headers = headers
  }

  _handleServerResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Error:${res.status}`)
  }

  _request(url, options) {
    return fetch(url, options).then((res) => this._handleServerResponse(res))
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    })
  }

  setUserInfo({ name, about }) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    })
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, { headers: this._headers })
  }

  addCard({ name, link }) {
    return this._request(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    })
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
  }

  likeCard(cardId) {
    return this._request(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: this._headers,
    })
  }

  unlikeCard(cardId) {
    return this._request(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
  }

  changeLikeCardStatus(cardId, like) {
    if (like) {
      return this.likeCard(cardId)
    } else {
      return this.unlikeCard(cardId)
    }
  }

  setUserAvatar({ avatar }) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    })
  }
}
const api = new Api({
  baseUrl: 'https://around.nomoreparties.co/v1/group-12',
  headers: {
    authorization: 'bdbcf068-f0a2-4438-8115-013f3ee9f311',
    'Content-Type': 'application/json',
  },
})

export default api
