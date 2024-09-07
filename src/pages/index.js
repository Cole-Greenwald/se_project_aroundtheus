import Card from "../components/Card.js";
import Popup from "../components/Popup.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import "../pages/index.css";
import {
  config,
  profileTitle,
  profileDescription,
  profileTitleInput,
  profileDescriptionInput,
  profileEditModal,
  profileEditForm,
  profileEditButton,
  profileModalCloseButton,
  addCardModalCloseButton,
  addNewCardButton,
  addCardModal,
  addCardFormElement,
  initialCards,
} from "../utils/constants.js";

const editFormValidator = new FormValidator(config, profileEditForm);
const addFormValidator = new FormValidator(config, addCardFormElement);

editFormValidator.enableValidation();
addFormValidator.enableValidation();

function createCard(item) {
  const card = new Card(item, "#card-template", handleImageClick);
  return card.getView();
}

const cardListEl = new Section(
  {
    items: initialCards,
    renderer: (data) => {
      cardListEl.addItem(createCard(data));
    },
  },

  ".cards__list"
);

cardListEl.renderItems();

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
});

const cardImageModal = new PopupWithImage("#preview-image-modal");
cardImageModal.setEventListeners();

function handleImageClick(cardData) {
  cardImageModal.open(cardData);
}

const addCardPopup = new PopupWithForm(
  "#add-card-modal",
  handleAddCardFormSubmit
);
addCardPopup.setEventListeners();

const editProfilePopup = new PopupWithForm(
  "#profile-edit-modal",
  handleProfileEditSubmit
);
editProfilePopup.setEventListeners();

function handleProfileEditSubmit(formData) {
  userInfo.setUserInfo({
    name: formData.title,
    description: formData.description,
  });
  editProfilePopup.close();
}

function handleAddCardFormSubmit(inputValues) {
  console.log(inputValues);
  const name = inputValues.title;
  const link = inputValues.Url;
  const cardData = { name, link };
  cardListEl.addItem(createCard(cardData));
  console.log(cardData);
  addCardPopup.close();
  addCardFormElement.reset();
}

profileEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  profileTitleInput.value = currentUserInfo.name;
  profileDescriptionInput.value = currentUserInfo.description;
  editProfilePopup.open();
});

addNewCardButton.addEventListener("click", () => {
  addCardPopup.open();
});
