import Popup from "./Popup.js";

export default class PopupConfirmation extends Popup {
  constructor(popupSelector, handleConfirmation) {
    super({ popupSelector });
    this._confirmButton = document.querySelector("#confirmation-modal");
    this._handleConfirmation = handleConfirmation;
    this._setEventListeners();
  }

  open(cardId, cardElement) {
    super.open();
    this._cardId = cardId;
    this._cardElement = cardElement;
  }

  _setEventListeners() {
    super.setEventListeners();
    this._confirmButton.addEventListener("click", () => {
      this._handleConfirmation(this._cardId, this._cardElement)
        .then(() => {
          this.close();
        })
        .catch((err) => {
          console.error("Error Deleting Card", err);
        });
    });
  }
}
