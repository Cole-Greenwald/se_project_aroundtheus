export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  // Card functions
  // Loading cards from the server
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: "GET",
    }).then(this._handleResponse);
  }

  //Adding a new card
  createCard(card) {
    const requestBody = JSON.stringify({
      name: card.name,
      link: card.link,
    });
    console.log("Request Body:", requestBody);

    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: "POST",
      body: requestBody,
    }).then(this._handleResponse);
  }
  // Deleting a card
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      headers: this._headers,
      method: "DELETE",
    }).then(this._handleResponse);
  }

  // Adding and removing likes
  likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: "PUT",
    }).then(this._handleResponse);
  }

  dislikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: "DELETE",
    }).then(this._handleResponse);
  }

  // Edit Info
  //Loading user information from the server
  async getUserInfo() {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: "GET",
    });
    return this._handleResponse(res);
  }

  // Editing the profile
  async updateUserProfile(userData) {
    const res = await fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify(userData),
    });
    return this._handleResponse(res);
  }

  // Updating profile picture
  updateAvatar(avatarUrl) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({ avatar: avatarUrl }),
    }).then(this._handleResponse);
  }
}
