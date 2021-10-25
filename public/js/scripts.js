const buttons = document.querySelectorAll(".button");
const infos = document.querySelectorAll(".info");

const buttonAddIngredient = document.querySelector("#addNewIngredient");
const buttonAddPreparation = document.querySelector("#addNewStep");
const buttonsDelete = document.querySelectorAll(".buttonDelete");

const currentPage = location.pathname;
const menuItems = document.querySelectorAll("header.links a");
const menuItemsAdmin = document.querySelectorAll(".links-admin a")

const formDelete = document.querySelector("#form-delete");


// === MENU ACTIVE 

for (item of menuItems) {
  if(currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
};

for (item of menuItemsAdmin) {
  if(currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("admin-active");
  }
};


// === MOSTRA/ESCONDER 

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.innerHTML === "Esconder") {
      button.innerHTML = "Mostrar";
    } else {
      button.innerHTML = "Esconder";
    }

    infos.forEach((info) => {
      if (info.classList[1] === button.classList[1]) {
        info.classList.toggle("hide");
      }
    });
  });
});

// === CLONE INPUT ===

const cloneInput = (field) => {
  const container = document.querySelector(`#${field}`);
  const input = document.querySelectorAll(`.${field}`);

  const newInput = input[input.length - 1].cloneNode(true);

  if (newInput.children[0].value == "") return false;
  
  newInput.children[1].addEventListener("click", () => newInput.children[1].parentElement.remove());
  newInput.children[0].value = "";

  container.appendChild(newInput);
}

buttonsDelete.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.parentElement.length >= 1) 
      button.parentElement.remove();

    return false; 
  })
});

function cloneInputs(buttonAdd, input) {
  buttonAdd.addEventListener("click",() => cloneInput(input));
};

const clone = document.querySelectorAll(".clone");

if (buttonAddIngredient || buttonAddPreparation) {
  cloneInputs(buttonAddPreparation, "preparation");
  cloneInputs(buttonAddIngredient, "ingredient");
};

// === CONFIRM DELETE === 

if (formDelete) {
  formDelete.addEventListener("submit", (event) => {
    const confirmation = confirm("Deseja continuar?");
    
    if(!confirmation) {
      event.preventDefault();
    };
  });
};

// === IMAGES UPLOAD ===

const ImagesUpload = {
  input: "",
  preview: document.querySelector('#images-preview'),
  uploadLimit: 5,
  files: [],

  handleFileInput(event) {
    const { files: fileList } = event.target;
    ImagesUpload.input = event.target;

    if (ImagesUpload.hasLimit(event)) return;

    Array.from(fileList).forEach(file => {

      ImagesUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = ImagesUpload.getContainer(image);
        ImagesUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    
    });

    ImagesUpload.input.files = ImagesUpload.getAllFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = ImagesUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens`)
      event.preventDefault()
      return true;
    };

    const imagesDiv = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "images")
        imagesDiv.push(item)
    })
    
    const totalImages = fileList.length + imagesDiv.length;
    if (totalImages > uploadLimit) {
      alert("Você atingiu o limite máximo de imagens!");
      event.preventDefault()
      return true;
    };

    return false;
  },
  getAllFiles(){
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

    ImagesUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('images');

    div.onclick = ImagesUpload.removeImage;

    div.appendChild(image);

    div.appendChild(ImagesUpload.getRemoveButton());

    return div;
  },
  getRemoveButton() {
    const button = document.createElement('i');
    button.classList.add('material-icons');
    button.innerHTML = "delete";
    return button;
  },
  removeImage(event) {
    const imagesDiv = event.target.parentNode; // <div class="images">
    const imagesArray = Array.from(ImagesUpload.preview.children);
    const index = imagesArray.indexOf(imagesDiv);

    ImagesUpload.files.splice(index, 1);
    ImagesUpload.input.files = ImagesUpload.getAllFiles();

    imagesDiv.remove();
  },
  removeOldImage(event) {
    const imageDiv = event.target.parentNode;
    
    if(imageDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]');
      if (removedFiles) {
        removedFiles.value += `${imageDiv.id},`
      };
    };

    imageDiv.remove()
  }
};

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(e) {
    const { target } = e;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
  }
};