// Mengonversi file yang diunggah menjadi URL gambar
function convertImageToURL(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(imageFile);
    });
}

// Menampilkan modal saat tombol "Buat Artikel" diklik
document.getElementById("create-article-btn").addEventListener("click", function() {
    document.getElementById("article-modal").style.display = "block";
});

// Menyembunyikan modal saat tombol "Tutup" diklik atau saat klik di luar modal
var modal = document.getElementById("article-modal");
var closeModalBtn = document.getElementsByClassName("close")[0];

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

closeModalBtn.onclick = function() {
    modal.style.display = "none";
};

// Menambahkan event listener pada form untuk menambahkan artikel
document.getElementById("article-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    var title = document.getElementById("article-title").value;
    var imageInput = document.getElementById("article-image");
    var description = document.getElementById("article-description").value;
    
    if (title.trim() === '' || imageInput.files.length === 0 || description.trim() === '') {
        alert("Judul artikel, gambar, dan deskripsi harus diisi!");
        return;
    }
    
    var imageFile = imageInput.files[0];
    var imageUrl = await convertImageToURL(imageFile);
    
    var article = {
        title: title,
        image: imageUrl,
        description: description
    };
    
    var articles = JSON.parse(localStorage.getItem("articles")) || [];
    articles.push(article);
    localStorage.setItem("articles", JSON.stringify(articles));
    
    renderArticles();
    
    // Reset form fields
    document.getElementById("article-title").value = '';
    document.getElementById("article-image").value = '';
    document.getElementById("article-description").value = '';
    
    // Sembunyikan modal setelah artikel ditambahkan
    modal.style.display = "none";
});

// Fungsi untuk menghapus artikel dari localStorage berdasarkan elemen artikel yang dihapus
function removeArticleFromLocalStorage(articleDiv) {
    var articleList = JSON.parse(localStorage.getItem("articles")) || [];
    var title = articleDiv.querySelector("h2").textContent;
    var updatedArticleList = articleList.filter(function(article) {
        return article.title !== title;
    });
    localStorage.setItem("articles", JSON.stringify(updatedArticleList));
}

// Fungsi untuk menampilkan artikel di halaman
function renderArticles() {
    var articleList = document.getElementById("article-list");
    articleList.innerHTML = '';
    
    var articles = JSON.parse(localStorage.getItem("articles")) || [];
    
    articles.forEach(function(article) {
        var articleDiv = document.createElement("div");
        articleDiv.classList.add("article");
        
        var articleTitle = document.createElement("h2");
        articleTitle.textContent = article.title;
        
        var articleImage = document.createElement("img");
        articleImage.src = article.image;
        
        var articleDescription = document.createElement("p");
        articleDescription.textContent = article.description;
        
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus";
        deleteButton.classList.add("delete-btn");
        
        deleteButton.addEventListener("click", function() {
            var articleDiv = this.parentElement;
            articleDiv.remove(); // Menghapus elemen artikel dari DOM
            removeArticleFromLocalStorage(articleDiv); // Menghapus artikel dari localStorage
        });
        
        articleDiv.appendChild(articleTitle);
        articleDiv.appendChild(articleImage);
        articleDiv.appendChild(articleDescription);
        articleDiv.appendChild(deleteButton);
        
        articleList.appendChild(articleDiv);
    });
}

// Panggil fungsi renderArticles saat halaman dimuat
renderArticles();
