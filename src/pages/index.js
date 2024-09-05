import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import "../pages/index.css";

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

//Validaiton Settings
const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

//Template for ID
const cardData = {
  name: "Yosemite Valley",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
};

const cardSelector = "#card-template";

// Elements
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileModalCloseButton = profileEditModal.querySelector(
  "#modal-close-button"
);

//Validation Elements
const addCardFormElement = document.querySelector("#add-card-modal");
const profileEditForm = profileEditModal.querySelector("#profile-edit-form");

const editFormValidator = new FormValidator(config, profileEditForm);
editFormValidator.enableValidation();

const addCardValidator = new FormValidator(config, addCardFormElement);
addCardValidator.enableValidation();

const profileHeader = document.querySelector(".profile__title");
const profileParagraph = document.querySelector(".profile__description");
const profileHeaderInput = document.querySelector("#profile-title-input");
const profileParagraphInput = document.querySelector(
  "#profile-description-input"
);

const cardsWrap = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const addNewCardButton = document.querySelector(".profile__add-button");
const addCardModal = document.querySelector("#add-card-modal");
const pictureModal = document.querySelector("#preview-image-modal");
const modalImage = pictureModal.querySelector("#modal-image");
const modalImageCaption = pictureModal.querySelector("#modal-caption");
const imageModalCloseButton = pictureModal.querySelector("#modal-close-button");
const addCardModalCloseButton = addCardModal.querySelector(
  "#modal-close-button"
);

const cardTitleInput = addCardFormElement.querySelector("#card-title-input");
const cardLinkInput = addCardFormElement.querySelector("#card-url-input");

const modals = document.querySelectorAll(".modal");

// Functions

function closePopupEsc(e) {
  if (e.key === "Escape") {
    const modalOpened = document.querySelector(".modal_opened");
    closePopup(modalOpened);
  }
}

function closePopupOverlay(e) {
  if (e.target === e.currentTarget) {
    closePopup(e.currentTarget);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closePopupEsc);
  modal.addEventListener("mousedown", closePopupOverlay);
}

function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closePopupEsc);
  modal.removeEventListener("mousedown", closePopupOverlay);
}

function createCard(item) {
  const card = new Card(item, cardSelector, handleImageClick);
  return card.getView();
}

function renderCard(cardData, wrapper) {
  const cardElement = createCard(cardData);
  wrapper.prepend(cardElement);
}

// Event Handler

function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileHeader.textContent = profileHeaderInput.value;
  profileParagraph.textContent = profileParagraphInput.value;
  closePopup(profileEditModal);
}

function handleAddCardFormSubmit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardLinkInput.value;
  renderCard({ name, link }, cardsWrap);
  e.target.reset();
  closePopup(addCardModal);
  //addCardValidator.resetValidation();
  addCardValidator.disableSubmitButton();
}

function handleImageClick(cardData) {
  console.log(cardData); // Log to ensure the correct data is received
  if (cardData && cardData.link && cardData.name) {
    modalImage.src = cardData.link;
    modalImage.alt = cardData.name;
    modalImageCaption.textContent = cardData.name;
    openModal(pictureModal);
  } else {
    console.error("Image link or name is missing in cardData");
  }
}

// Event Listeners

imageModalCloseButton.addEventListener("click", () => closePopup(pictureModal));

addNewCardButton.addEventListener("click", () => openModal(addCardModal));
addCardModalCloseButton.addEventListener("click", () =>
  closePopup(addCardModal)
);

profileEditButton.addEventListener("click", () => {
  profileHeaderInput.value = profileHeader.textContent;
  profileParagraphInput.value = profileParagraph.textContent;
  openModal(profileEditModal);
});
profileModalCloseButton.addEventListener("click", () =>
  closePopup(profileEditModal)
);
profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

//Initial render
initialCards.forEach((cardData) => renderCard(cardData, cardsWrap));
