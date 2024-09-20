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
import PopupConfirmation from "../components/PopupConfirmation.js";

const editFormValidator = new FormValidator(config, profileEditForm);
const addFormValidator = new FormValidator(config, addCardFormElement);
const avatarFormValidator = new FormValidator(config, avatarEditForm);

editFormValidator.enableValidation();
addFormValidator.enableValidation();
avatarFormValidator.enableValidation();

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "09ef8b3f-9d1c-4c1f-8d18-35c5768d1784",
    "Content-Type": "application/json",
  },
});

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

const cardListEl = new Section(
  {
    items: initialCards,
    renderer: (data) => {
      cardListEl.addItems(createCard(data));
    },
  },

  ".cards__list"
);

cardListEl.renderItems();

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

const cardImageModal = new PopupWithImage("#preview-image-modal");
cardImageModal.setEventListeners();

function handleImageClick(cardData) {
  cardImageModal.open(cardData);
}
const deleteModalConfirmation = new PopupConfirmation(
  "#modal-confirm",
  async (cardId, cardElement) => {
    try {
      await api.deleteCard(cardId);
      cardElement.remove();
    } catch (err) {
      console.error(`Error On Card Deletion ${err}`);
    }
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

const editProfilePopup = new PopupWithForm(
  "#profile-edit-modal",
  async (data) => {
    await api.updateUserProfile({
      name: data.title,
      about: data.description,
    });
    userInfo.setUserInfo({
      title: data.title,
      description: data.description,
    });
  }
);
editProfilePopup.setEventListeners();

const addCardPopup = new PopupWithForm("#add-card-modal", async (data) => {
  const name = data.title;
  const link = data.url;

  const res = await api.createCard({ name, link });
  cardListEl(res);
});

addCardPopup.setEventListeners();

const editAvatarModal = new PopupWithForm(
  "#edit-avatar-modal",
  async (formData) => {
    const avatarUrl = formData.avatar;
    const userData = await api.updateAvatar(avatarUrl);
    userInfo.setUserAvatar(userData.avatar);
  }
);

editAvatarButton.addEventListener("click", () => {
  avatarFormValidator.resetValidation();
  editAvatarModal.open();
});

editAvatarModal.setEventListeners();

profileEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  profileTitleInput.value = currentUserInfo.name;
  profileDescriptionInput.value = currentUserInfo.description;
  editFormValidator.resetValidation();
  editProfilePopup.open();
});

addNewCardButton.addEventListener("click", () => {
  addFormValidator.resetValidation();
  addCardPopup.open();
});
