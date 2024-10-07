import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super({ popupSelector });
    this._popupForm = this._popupElement.querySelector(".modal__form");
    this._inputList = this._popupForm.querySelectorAll(".modal__input");
    this._handleFormSubmit = handleFormSubmit;
    this._submitButton = this._popupForm.querySelector(".modal__button");
    this._submitButtonText = this._submitButton.textContent;
  }

  renderLoading(isLoading) {
    if (isLoading) {
      this._submitButton.textContent = "Saving...";
    } else {
      this._submitButton.textContent = this._submitButtonText;
    }
  }

  _getInputValues() {
    const inputValues = {};
    this._inputList.forEach((input) => {
      inputValues[input.name] = input.value;
    });

    return inputValues;
  }

  enableSubmit() {
    this._submitButton.disabled = false;
  }

  disableSubmit() {
    this._submitButton.disabled = true;
  }

  setEventListeners() {
    this._popupForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const formData = this._getInputValues();
      this.renderLoading(true);
      this.disableSubmit();
      this._handleFormSubmit(formData)
        .then(() => {
          console.log(`Success:`, formData);
          this.close();
          this._popupForm.reset();
        })
        .catch((err) => {
          console.error(`Error Submitting Form: ${err}`);
        })
        .finally(() => {
          this.renderLoading(false);
          this.enableSubmit();
        });
    });
    super.setEventListeners();
  }

  close() {
    this._popupForm.reset();
    super.close();
  }
}
