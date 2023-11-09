// PARENT VIEW FOR THE PREVIEW ELEMENTS BECAUSE THERE IS A LOT OF REDUNDANT CODE BETWEEN THE TWO LIKE WITH THE RESULTS VIEW AND THE BOOKMARKS VIEW
import View from './view';
import icons from 'url:../../img/icons.svg'; // parcel 2 syntax for importing images
class PreviewView extends View {
  // parent element
  _parentElement = '';

  //
  _generateMarkup() {
    const id = window.location.hash.slice(1); // getting the current id for the recipe

    return `
    <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? 'preview__link--active' : ''
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.publisher}</p>
          <div class="preview__user-generated ${
            this._data.key ? '' : 'hidden'
          }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
    `;
  }
}

export default new PreviewView();
// exporting an instance object of this class makes it so that we don't have to manually make an instance variable when using this in other modules.
