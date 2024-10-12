export default class Card {
  constructor(
    cardData,
    cardSelector,
    handleImageClick,
    handleDeleteCard,
    handleLikeClick
  ) {
    this._name = cardData.name;
    this._link = cardData.link;
    this._id = cardData._id;
    this._setIsLiked = cardData.isLiked;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this.handleDeleteCard = handleDeleteCard;
    this.handleLikeClick = handleLikeClick;
  }

  _setEventListeners() {
    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._handleLikeIcon();
      });

    this._cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this.handleDeleteCard(this);
      });

    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this.handleLikeClick(this);
      });
  }

  _handleLikeIcon() {
    this._cardElement
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active");
  }

  getId() {
    return this._id;
  }

  remove() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  setIsLiked(isLiked) {
    this._isLiked = isLiked;
    this.renderLikeIcon();
  }
  renderLikeIcon() {
    if (this._isLiked) {
      classList.add("card__like-button_active");
    } else {
      classList.remove("card__like-button_active");
    }
  }

  handleLikeButton(isLiked) {
    if (isLiked !== undefined) {
      this._isLiked = isLiked;
    }
    if (this._isLiked) {
      this.toggleLike();
    }
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._cardElement.querySelector(".card__image").src = this._link;
    this._cardElement.querySelector(".card__image").alt = this._name;
    this._cardElement.querySelector(".card__title").textContent = this._name;

    this._setEventListeners();
    return this._cardElement;
  }
}
