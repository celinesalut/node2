document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edition")) {
    // alert('btn');
    let spanContenu = e.target.parentElement.parentElement.querySelector(
      ".chose-text"
    );

    let ancienContenu = spanContenu.innerHTML;

    let nouveauContenu = prompt(
      "Indiquez le nouveau contenu SVP",
      ancienContenu
    );

    if (nouveauContenu) {
      let idChose = e.target.getAttribute("data-id");

      axios
        .post("/editer", { contenu: nouveauContenu, id: idChose })
        .then(() => {
          // requête terminée
          spanContenu.innerHTML = nouveauContenu;

          // e.target.parentElement.parentElement.getElementByClassName('chose-text')[0].innerHTML= nouveauContenu;
        })
        .catch(() => {
          console.log("Un problème est survenu durant la Maj");
        });
    }

    if (e.target.classList.contains('btn-suppression')) {
        let idChose = e.target.getAttribute('data-id');
        axios.post('/supprimer', {id: idChose}).then(() => {
        // e.target.parentElement.parentElement.remove
        e.target.parentElement.parentElement.remove()
    }
    )}

  }
});
