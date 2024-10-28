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
    authorization: "05177711-40d5-4e6a-abe7-ba1645f6efc9",
    "Content-Type": "application/json",
  },
});

function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    handleImageClick,
    handleDeleteCard,
    handleLikeClick
  );
  return card.getView();
}

function renderItems(items) {
  items.forEach((item) => {
    this._renderer(item);
  });
}
let cardSection;
api
  .getInitialCards()
  .then((cards) => {
    // Initialize cardSection before using it
    cardSection = new Section(
      {
        items: cards,
        renderer: (item) => {
          const card = createCard(item);
          cardSection.addItem(card);
        },
      },
      ".cards__list"
    );

    cardSection.renderItems();
  })
  .catch(console.error);

const addCardPopup = new PopupWithForm("#add-card-modal", async (formData) => {
  const name = formData.title;
  const link = formData.Url;

  const res = await api.createCard({ name, link });
  cardSection.addItem(createCard(res)); // Use here after initialization

  addNewCardButton.addEventListener("click", () => {
    addFormValidator._disableSubmitButton();
    addCardPopup.open();
  });
});

addCardPopup.setEventListeners();

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

function handleDeleteCard(card) {
  deleteModalConfirmation.setSubmitAction(() => {
    api
      .deleteCard(card.getId())
      .then(() => {
        card.remove();
        deleteModalConfirmation.close();
      })
      .catch((err) => {
        console.error(err);
      });
  });
  deleteModalConfirmation.open();
}

function handleLikeClick(card) {
  if (card.setIsLiked) {
    api
      .dislikeCard(card._id)
      .then(() => {
        card.handleLikeIcon();
      })

      .catch(console.error);
  } else {
    api
      .likeCard(card._id)
      .then(() => {
        card.handleLikeIcon();
      })

      .catch((err) => {
        console.error(err);
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
  profileTitleInput.value = currentUserInfo.title;
  profileDescriptionInput.value = currentUserInfo.description;
  editFormValidator.resetValidation();
  editProfilePopup.open();
});

addNewCardButton.addEventListener("click", () => {
  addCardPopup.open();
});
