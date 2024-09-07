export default class UserInfo {
  constructor(userInfo) {
    this._nameInfo = document.querySelector(userInfo.nameSelector);
    this._descriptionInfo = document.querySelector(
      userInfo.descriptionSelector
    );
  }

  getUserInfo() {
    const userInfo = {};
    userInfo.name = this._nameInfo.textContent;
    userInfo.description = this._descriptionInfo.textContent;
    return userInfo;
  }

  setUserInfo(userInfo) {
    this._nameInfo.textContent = userInfo.name;
    this._descriptionInfo.textContent = userInfo.description;
  }
}
