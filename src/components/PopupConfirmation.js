import Popup from "./Popup.js";

export default class PopupConfirmation extends Popup {
  constructor(popupSelector, handleConfirmation) {
    super({ popupSelector });
    this._confirmButton = document.querySelector("#confirmation-modal-button");
    this._handleConfirmation = handleConfirmation;
    this._setEventListeners();
  }

  open(cardId, cardElement) {
    super.open();
    this._cardId = cardId;
    this._cardElement = cardElement;
  }

  setSubmitAction(action) {
    this._handleFormSubmit = action;
  }

  _setEventListeners() {
    super.setEventListeners();
    this._confirmButton.addEventListener("click", () => {
      this._handleFormSubmit();
    });
  }
}
