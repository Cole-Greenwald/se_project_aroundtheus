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
  editAvatarButton,
  avatarEditForm,
} from "../utils/constants.js";
import Api from "../components/Api.js";
import ModalConfirmation from "../components/ModalConfirmation.js";

const editFormValidator = new FormValidator(config, profileEditForm);
const addFormValidator = new FormValidator(config, addCardFormElement);
const avatarFormValidator = new FormValidator(config, avatarEditForm);

editFormValidator.enableValidation();
addFormValidator.enableValidation();
avatarFormValidator.enableValidation();

function createCard(item) {
  const card = new Card(
    item,
    "#card-template",
    handleImageClick,
    handleDeleteCard,
    handleLikeClick
  );
  return card.getView();
}

function renderCard(cardData) {
  const card = createCard(cardData);
  section.addItems(card);
}

// Cards and Info
let section;

api
  .getInitialCards()
  .then((cards) => {
    section = new Section(
      {
        items: cards,
        renderer: renderCard,
      },
      ".cards__list"
    );

    section.renderItems();
  })
  .catch((err) => console.error(err));

document.addEventListener("DOMContentLoaded", () => {
  function initialize() {
    const userInfo = new UserInfo({
      title: ".profile__title",
      description: ".profile__description",
      avatarSelector: ".profile__image",
    });

    api
      .getUserInfo()
      .then((userData) => {
        userInfo.setUserInfo({
          title: userData.name,
          description: userData.about,
          avatar: userData.avatar,
        });
      })
      .catch((err) => console.error(err));
  }
  initialize();
});

cardListEl.renderItems();

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

// Api
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "5e5b90ea-821d-446b-94c8-bd552c31d690",
    "Content-Type": "application/json",
  },
});

const cardImageModal = new PopupWithImage("#preview-image-modal");
cardImageModal.setEventListeners();

function handleImageClick(cardData) {
  cardImageModal.open(cardData);
}

const deleteModalConfirmation = new ModalConfirmation(
  "#modal-confirm",
  (cardId, cardElement) => {
    return api
      .deleteCard(cardId)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.error(`Error On Card Deletion ${err}`);
      });
  }
);

function handleDeleteCard(cardId, cardElement) {
  deleteModalConfirmation.open(cardId, cardElement);
}

function handleLikeClick(card) {
  if (card._isLiked) {
    api
      .dislikeCard(card._id)
      .then(() => {
        card.toggleLike();
        card._isLiked = false;
      })
      .catch((err) => {
        console.error(`Error on Card Dislike ${err}`);
      });
  } else {
    api
      .likeCard(card._id)
      .then(() => {
        card.toggleLike();
        card._isLiked = true;
      })
      .catch((err) => {
        console.error(`Error on Card Like ${err}`);
      });
  }
}

// ModalWithForm
// Update Profile
const profileEditModal = new ModalWithForm("#profile-edit-modal", (data) => {
  return api
    .updateUserProfile({
      name: data.title,
      about: data.description,
    })
    .then(() => {
      userInfo.setUserInfo({
        title: data.title,
        description: data.description,
      });
      profileEditModal.close();
    });
});
profileEditModal.setEventListeners();

// Add Card
const addCardModal = new ModalWithForm("#add-card-modal", (data) => {
  const name = data.title.trim();
  const link = data.url.trim();

  return api.createCard({ name, link }).then((res) => {
    renderCard(res);
    addCardModal.close();

    addCardFormElement.reset();
  });
});

addCardModal.setEventListeners();

// Update Avatar
const editAvatarModal = new ModalWithForm("#edit-avatar-modal", (formData) => {
  const avatarUrl = formData.avatar;
  return api
    .updateAvatar(avatarUrl)
    .then((userData) => {
      userInfo.setUserAvatar(userData.avatar);
    })
    .catch((err) => {
      console.error(`Error Submitting Form: ${err}`);
    });
});

editAvatarButton.addEventListener("click", () => {
  editAvatarModal.open();

  editAvatarModal.setEventListeners();
});

// ModalWithImage
const cardImageModal = new ModalWithImage("#card-image-modal");
cardImageModal.setEventListeners();

/* Functions */
function handleImageClick(link, name) {
  cardImageModal.open({ link, name });
}

const deleteModalConfirmation = new ModalConfirmation(
  "#modal-confirm",
  (cardId, cardElement) => {
    return api
      .deleteCard(cardId)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => {
        console.error(`Error On Card Deletion ${err}`);
      });
  }
);

function handleDeleteCard(cardId, cardElement) {
  deleteModalConfirmation.open(cardId, cardElement);
}

function handleLikeClick(card) {
  if (card._isLiked) {
    api
      .dislikeCard(card._id)
      .then(() => {
        card.toggleLike();
        card._isLiked = false;
      })
      .catch((err) => {
        console.error(`Error on Card Dislike ${err}`);
      });
  } else {
    api
      .likeCard(card._id)
      .then(() => {
        card.toggleLike();
        card._isLiked = true;
      })
      .catch((err) => {
        console.error(`Error on Card Like ${err}`);
      });
  }
}

// Form Listeners

profileEditButton.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();
  profileTitleInput.value = userData.title.trim();
  profileDescriptionInput.value = userData.description.trim();
  editFormValidator.resetValidation();
  profileEditModal.open();
});

// add new card
addNewCardButton.addEventListener("click", () => {
  addFormValidator.resetValidation();
  addCardModal.open();
});
