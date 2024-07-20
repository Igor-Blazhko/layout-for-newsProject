const fs = require('fs')
const env = require('./server.js')

function GeneratePage_AllPost(ArratPost, path){
    let BUFFER = '<main>';
    ArratPost.forEach(post => {
        BUFFER += `
        <div class="post">
            <div class="post-content">
                <div class="planet">
                    <i class="fas fa-globe-americas"></i>
                    <span class="moon"></span>
                </div>
                <div>
                    <h2 class="post-title">${post.article}</h2>
                    <p class="post-text">
                        ${post.text}
                    </p>
                </div>
                </div>
            <a href="post?id=${post.id}" class="read-more-button">Читать далее</a>
        </div>
    `
    });
    BUFFER += '</main>';
    fs.writeFile(path, BUFFER, (err) => {console.log(`Произошла ошибка чтения ${err}`)} )
}

function GeneratePage_Post(POST, USERS = null){
    let User = {}
    if (USERS){
        user = USERS.find((user) => +user.id === +POST.id)
    }
    let BUFFER = `
      <main>
    <a href="/" class="back-button">Назад</a>
    <a href="#comments" class="back-button">Показать комментарий</a>
    <div> Created by ${user.name} ${user.sername}</div>

    <div class="post-content-full">
      <img src="https://via.placeholder.com/150" alt="Post Image" class="post-image">
      <h2 class="post-title-full">${POST.article}</h2>
      <p class="post-text-full">
        ${POST.text}
      </p>
    </div>

    <section class="comments" id="comments">
      <h3>Комментарии</h3>
      <div class="comment">
        <p>Комментарий 1</p>
      </div>
      <div class="comment">
        <p>Комментарий 2</p>
      </div>
      <form action="" class="comment-form">
        <textarea name="comment" id="comment" rows="4" placeholder="Оставьте ваш комментарий" required></textarea>
        <button type="submit">Отправить</button>
      </form>
    </section>
  </main>
    `
    return BUFFER
}

function GeneratePage_HEAD(ArrayUsers) {
    
    let BUFFER = `
    <header>
        <div class="logo">News</div>
            <nav>
                <a href="${env.SERVER}/">Главная</a>
                <a href="${env.SERVER}/register">Регистрация</a>
                <a href="${env.SERVER}/login">Авторизация</a>
            </nav>
        <div class="search-bar">
        <input type="text" placeholder="Поиск по тегам">
            <select>
                <option value="" disabled>Выберите пользователя</option>
    `;
    ArrayUsers.forEach((user) => {
        BUFFER += `<option value="${user.id}">${user.name} ${user.sername}</option>`
    });
    BUFFER += `
            </select>
        </div>
    </header>
    `;

    return BUFFER
}

module.exports = { GeneratePage_AllPost, GeneratePage_Post, GeneratePage_HEAD };