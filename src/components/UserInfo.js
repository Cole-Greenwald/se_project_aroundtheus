export default class UserInfo {
  constructor({ title, description, avatarSelector }) {
    this._title = document.querySelector(title);
    this._description = document.querySelector(description);
    this._avatarElement = document.querySelector(avatarSelector);
  }

  getUserInfo() {
    return {
      title: this._title.textContent,
      description: this._description.textContent,
      avatar: this._avatarElement.src,
    };
  }

  setUserInfo({ title, description, avatar }) {
    if (title) this._title.textContent = title;
    if (description) this._description.textContent = description;
    if (avatar) this.setUserAvatar(avatar);
  }

  setUserAvatar(avatarUrl) {
    this._avatarElement.src = avatarUrl;
  }
}

const userInfo = new UserInfo({
  title: ".profile__title",
  description: ".profile__description",
  avatarSelector: ".profile__image",
});
