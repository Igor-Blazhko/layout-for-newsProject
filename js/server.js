const httt = require('http');
const path = require('path');
const fs = require('fs');
const generate = require('./g_AllPost')

const PORT = 3000;
const PROTOCOL = 'http://';
const HOST = `localhost`;
const SERVER = `${PROTOCOL}${HOST}:${PORT}`;
module.exports.SERVER = SERVER
const POSTS = [
    {
        id: 1,
        article: `ПОСТ 1`,
        text: `Это мой 1 пост`,
        UserId: 1,
    },
    {
        id: 2,
        article: `ПОСТ 2`,
        text: `Это мой 2 пост`,
        UserId: 2,
    },
    {
        id: 3,
        article: `ПОСТ 3`,
        text: `Это мой 3 пост`,
        UserId: 3,
    },
    {
        id: 4,
        article: `ПОСТ 4`,
        text: `Это мой 4 пост`,
        UserId: 2,
    },
    {
        id: 5,
        article: `ПОСТ 5`,
        text: `Это мой 5 пост`,
        UserId: 1,
    },
];

const USERS = [
    {
        id: 1,
        name: 'Igor',
        login: 'logIn',
        sername: 'Blazhko',
    },
    {
        id: 2,
        name: 'Igor',
        login: 'Lanki',
        sername: 'Lankin',
    },
    {
        id: 3,
        name: 'Igor',
        login: 'Toki',
        sername: 'Tokin',
    }
]


const BASE_path_temp = path.join(__dirname, '..', 'temp')
const BASE_path_style = path.join(__dirname, '..', 'styles')

const BASE_STYLE = '/STYLE'
const STYLE_path_index = path.join(BASE_path_style, 'index.css');
const STYLE_path_auth = path.join(BASE_path_style, 'auth.css');
const STYLE_path_main = path.join(BASE_path_style, 'main.css');
const STYLE_path_post = path.join(BASE_path_style, 'post.css');
const style = fs.readFileSync(STYLE_path_index) + fs.readFileSync(STYLE_path_auth) + fs.readFileSync(STYLE_path_main) + fs.readFileSync(STYLE_path_post);

const BASE = '/';
const BASE_index = path.join(BASE_path_temp, 'allPost', 'index.html');
generate.GeneratePage_AllPost(POSTS, BASE_index)
const index = fs.readFileSync(BASE_index)

const HTMLHEADER_path = path.join(BASE_path_temp, 'baseTemp' , 'htmlHEAD.html')
const HTMLhead = fs.readFileSync(HTMLHEADER_path)

const HTMLFOOTER_path = path.join(BASE_path_temp, 'baseTemp' , 'footer.html')
const HTMLFOOTER = fs.readFileSync(HTMLFOOTER_path)

const BASE_head = path.join(BASE_path_temp, 'baseTemp', 'head.html')
const buf_users = generate.GeneratePage_HEAD(USERS);
fs.writeFileSync(BASE_head, buf_users, {encoding: 'utf-8'})
const head = fs.readFileSync(BASE_head)

const POST = '/post';
const POST_path = path.join(BASE_path_temp, 'onePost', 'post.html')
const post = fs.readFileSync(POST_path)

const LOGIN = '/login';
const LOGIN_path = path.join(BASE_path_temp, 'login', 'login.html')
const login = fs.readFileSync(LOGIN_path)

const REGISTER = '/register';
const REGISTER_path = path.join(BASE_path_temp, 'register', 'register.html')
const register = fs.readFileSync(REGISTER_path)

const ERROR_404 = ''
const ERROR_404_path = path.join(BASE_path_temp, 'error', 'error_404.html')
const error_404 = fs.readFileSync(ERROR_404_path)

const getQuery = (string, query = {}) => {
    let name = '';
    let value = '';
    let newString = ''
    if (string.length <= 0){
        return query
    }
    const indexEquel = string.indexOf('=');
    const indexAmpersand = string.indexOf('&');
    if( indexAmpersand <=0){
        value = string.slice(indexEquel+1)
    }
    else{ 
        value = string.slice(indexEquel+1, indexAmpersand);
        newString = string.slice(indexAmpersand+1);
    }
    name = string.slice(0, indexEquel);
    query[name] = value
    getQuery(newString, query);
    return query
}

const GETmethod = (req, res) => {
    const queryIndex = req.url.indexOf('?');
    let url = '';
    let query = '';
    let BUFFER = '';
    
    if (queryIndex>=0){
        url = req.url.slice(0, queryIndex);
        query =  req.url.slice(queryIndex+1);
        query= getQuery(query)
    }
    else {
        url = req.url
    }
    
    if (url === BASE_STYLE) {
        res.setHeader( 'Content-type', 'text/css', { encoding: 'utf-8' } );
        res.setHeader( 'Cache-Control', 'max-age=0, cache, no-store', { encoding: 'utf-8' } );
    }
    else{
        res.setHeader( 'Content-type', 'text/html', { encoding: 'utf-8' } );
        res.setHeader( 'Cache-Control', 'public, max-age=0, cache, no-store', { encoding: 'utf-8' } );
        BUFFER = HTMLhead + head;
        res.write(BUFFER)
    }
   
    switch (url){
        case BASE:
            const readIndex = fs.createReadStream(BASE_index, {encoding: 'utf-8'});
            readIndex
                .pipe(res)
                .on('error',(err) =>{
                    console.log(`this error ${err}`)
                    readIndex.end()
                })
                .on('finish', () => {
                    console.log('end write')
                    res.write(HTMLFOOTER)
                    res.end()
                })
            break;
        case LOGIN:
            const readSLogin = fs.createReadStream(LOGIN_path, {encoding: 'utf-8'});
            readSLogin
                .on('error',(err) =>{
                    console.log(`this error ${err}`);
                    readSLogin.end()
                })
                .on('end', () => {
                    res.write(HTMLFOOTER)
                    res.end()
                })
                .pipe(res)
            break;
        case POST:
            const post = POSTS.find((post) => post.id === +query.id)
            const BUF = generate.GeneratePage_Post(post, USERS)
            res.write(BUF);
            res.end()
            break;
        case REGISTER:
            const readSRegister = fs.createReadStream(REGISTER_path, {encoding: 'utf-8'});
            readSRegister
                .on('error',(err) =>{
                    console.log(`this error ${err}`);
                    readSRegister.end()
                })
                .on('end', () => {
                    res.write(HTMLFOOTER)
                    res.end()
                })
                .pipe(res)
            break;
        case BASE_STYLE:          
            res.write(style);
            res.end()
            break;
        default:
            const readSError = fs.createReadStream(ERROR_404_path, {encoding: 'utf-8'});
            readSError
            .on('error',(err) =>{
                console.log(`this error ${err}`)
            })
            .on('end', () => {
                res.write(HTMLFOOTER)
                res.end()
            })
            .pipe(res)
            break;
    }
    return
};

const POSTmethd = () => {};

const Router = (req, res)=>{
    switch (req.method){
        case "GET":
            GETmethod(req, res)
            break;
        case "POST":
            POSTmethd(req, res)
            break;
        default:
            break;
    }
    return
}
const runServer = ()=>{


    const app = httt.createServer(Router)
    app.listen( PORT, HOST, ()=>{
        console.clear()
        console.log('Server is READY!')
    });

    app.on('exit', (err) => {
        app.listen( PORT, HOST, ()=>{
            console.log(`Server error: ${err}`)
            console.log('Server is ReUP!')
        });
    })
}

runServer()

