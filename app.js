import express from 'express';
//import {PORT} from './config.js';
import {Telegraf} from 'telegraf';
import Markup from 'telegraf/markup';
import {getMenu, showFriendsFn, getMenuAdd, monthsKeyboard, likeDislikeKeyboard, editKeyboard, deleteKeyboard} from './keyboard.js'
import fs from 'fs';
import g from 'file-saver';
import dotenv from 'dotenv'
dotenv.config()



const app = express();
//dsfdsf
const bot = new Telegraf(process.env.TOKEN);
const PORT = process.env.PORT;
let name = 'default_name';
let fsm = '';
let bdayFlag = false;
let users = [];
let fileName = null;

function getUserFileName(){
    return `users.txt`
}


bot.start(ctx => {
    ctx.reply('Нарешті!',getMenu());
   

});



/*if(fs.existsSync(getUserFileName(ctx.from.id))){

    let data = fs.readFileSync('users.txt');
    users = JSON.parse(data)

}
else{
    console.log("Файлу 'users.txt' не існує. Починаємо спочатку")
}*/

let birthday = new Date();
birthday.setHours(0);
birthday.setMinutes(0);
birthday.setSeconds(0);
birthday.setMilliseconds(0);

let create = false;

let User = function(user_name, user_bd, user_bd_date, user_gift, user_hobby){
    this.user_name=user_name;
    this.user_bd=user_bd;
    this.user_bd_date=user_bd_date;
    this.user_gift=user_gift;
    this.user_hobby=user_hobby;

}

let user = new User("noname","no data","no data","no data"); //тут створюється дефолтний юзер

function editButtons(users){
    return users.map((user,index)=>{
        return[
            {text: `Редагувати ${user.user_name}`,
             callback_data: `edit_${index}`}
        ]
    })
}

bot.action(/edit_(\d+)/, (ctx) =>{
    let userIndex = ctx.match[1];

    if (!users[userIndex]){
        return ctx.reply('Користувача не знайдено')
    }

    ctx.reply(`Що саме для ${users[userIndex].user_name} ми будемо редагувати?`, editKeyboard(userIndex))
})

bot.action(/edit_name_(\d+)/, (ctx) =>{
    let userIndex = ctx.match[1];
    fsm = { action: "edit_name",
        userIndex
    };
    ctx.editMessageText(`Введіть нове ім'я для ${users[userIndex].user_name}`)

})

bot.action(/edit_gift_(\d+)/, (ctx) =>{
    let userIndex = ctx.match[1];
    fsm = { action: "edit_gift",
        userIndex
    };
    ctx.editMessageText(`Введіть нову ідею для подарунку ${users[userIndex].user_name}`)

})
bot.action(/edit_hobby_(\d+)/, (ctx) =>{
    let userIndex = ctx.match[1];
    fsm = { action: "edit_hobby",
        userIndex
    };
    ctx.editMessageText(`Введіть нове хобі ${users[userIndex].user_name}`)

})

bot.action(/delete_(\d+)/, (ctx) =>{
    let userIndex = ctx.match[1];
    fsm = { action: "delete",
        userIndex
    };
    ctx.editMessageText(`Точно видалити ${users[userIndex].user_name} ?`, deleteKeyboard())

})

bot.action('confirm_delete', (ctx) =>{

    let userIndex = fsm.userIndex;
    users.splice(userIndex,1);
    ctx.editMessageText(`Користувача видалено`);
    saveToFile(users,ctx);
    fsm = null;

})

bot.action('cancel_delete', (ctx) =>{

    ctx.editMessageText(`Видалення скасовано`);
    fsm = null;

})


async function saveToFile(users,ctx) {
try{
    await fs.promises.writeFile(getUserFileName() , JSON.stringify(users, null, 2));
    console.log('Оновлення файлу завершено');
    }

catch(error){
    console.log('Помилка запису у файл', error)
}
    
}

bot.action(/m(\d+)/, (ctx) =>{
    let month = ctx.match[1];


    birthday.setMonth(month-1);

    user.user_bd_date.setMonth(month-1);

    //console.log(birthday);


   // ctx.editMessageText('січень');
    user.user_bd = user.user_bd + '-' + month;
    //ctx.editMessageText('дата народження: '+user.user_bd);
    ctx.reply("Знаєш дату народження?", likeDislikeKeyboard());
} );

bot.action('like', (ctx) =>{
    ctx.editMessageText('Введіть рік народження');
    bdayFlag = true;
    fsm = 'year';
} );

bot.action('dislike', (ctx) => {
    let today = new Date();
    ctx.editMessageText("Дата народження друга: "+user.user_bd);
    let a = today.getFullYear();
    console.log(a);
    user.user_bd += `-${a}`;

    birthday.setYear(a);
    user.user_bd_date.setYear(a);
});




bot.hears('five😂😂😂😂😂',ctx =>{
    
    name = ctx.from.username;
    ctx.reply('Привіт, '+name);
    console.log(name + ' доєднався \n');

    fs.writeFile('users.txt',name, err =>{
        if(err){
            console.log(err);
        }
        else{
            console.log('Користувача '+name + ' успішно додано до файлу даних.')
        }
    })
});

bot.hears('Додати друга',ctx =>{
  
    ctx.reply("Без проблем!",getMenuAdd());
   
    }
);

bot.hears('Головне меню',ctx =>{
    
        ctx.reply("Вихожу в головне меню!",getMenu());
        
        }
);

bot.hears("Запам'ятати друга",ctx =>{


        
    let clone = Object.assign({},user);

    let userID = ctx.from.id

    if(fs.existsSync(getUserFileName())){

        let data = fs.readFileSync(getUserFileName());
        users = JSON.parse(data)
    
    }
    else{
        console.log("Файлу 'users.txt' не існує. Починаємо спочатку")
    }
   // let data = fs.readFileSync(getUserFileName(userID));
    //users = JSON.parse(data)

    console.log(clone);
    
    users.push(clone);


    saveToFile(users,ctx)
    users = [];

    ctx.reply("Друга додано",getMenu());
   
    user.user_name="noname";
    user.user_bd="no data";
    user.user_gift="no data";
    user.user_hobby="no data";

})

 bot.hears("Подивитись друзів",ctx =>{
   
    let userID = ctx.from.id
    let data = fs.readFileSync(getUserFileName());
    users = JSON.parse(data)
   // users = JSON.parse(getUserFileName(userID))
if(users.length ===0){
    ctx.reply("Жодного друга не додано",getMenu());
}
else{
    ctx.reply("Список друзів завантажено",showFriendsFn());
     
}})

bot.hears("Ім'я",ctx =>{
       fsm='name';
       ctx.reply("Введіть ім'я друга");
    })
    
    bot.hears("Дата народження", ctx =>{
        fsm='bday'
        ctx.reply("Введіть ДН друга");
    });

    bot.hears("Хобі", ctx =>{
        fsm='hobby'
        ctx.reply("Введіть хобі друга");
    });   

    bot.hears("Ідея подарунку", ctx =>{
        fsm='gift'
        ctx.reply("Введіть НАЙКРАЩИЙ подарунок для друга");
    });  
  
let strName;  


let sortArr = function(array){

    array.sort((a, b) => a.user_bd_date - b.user_bd_date);
    return array;
}

function formatArr(arr) {
    return arr.map((user, index) => {
        const date = new Date(user.user_bd_date);
        const formattedDate = date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'long' });
        
        return (
            `💠 ${index + 1}\n` +
            `<i><b>Ім'я:</b></i> ${user.user_name}\n` +
            `<i><b>Дата народження:</b></i> ${formattedDate}\n` +
            `<i><b>Хобі:</b></i> ${user.user_hobby}\n` +
            `<i><b>Ідея подарунку:</b></i> ${user.user_gift}\n` +
            '________________________\n'
        );
    }).join('');
}


bot.hears("Подивитись всіх",ctx =>{
    fsm='';
    let frUsers; 
    let userID = ctx.from.id;

    fs.readFile(getUserFileName(),(err, jsonData) =>{
        if(err){
            console.error('Помилка читання з файлу',err);
            return;
        }
        else{

            frUsers = JSON.parse(jsonData);
            console.log('ОСЬ ОСЬ ВІН!!!'+frUsers);
        }
    }
    )

    ctx.reply(formatArr(sortArr(users)), {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: editButtons(users)
        }  // Наприклад, для кнопок
    });    
 })


 function leftDays (bdate){
  
    const today = new Date();
    let currentYear = today.getFullYear();
   

    if (!(bdate instanceof Date)) {
        bdate = new Date(bdate); // Пробуємо створити дату з аргументу
      }

    let nextBday = new Date(currentYear, bdate.getMonth(), bdate.getDate())
   
    if(nextBday<today){
        nextBday.setFullYear(currentYear+1)
    }

    console.log(nextBday-today);
    let dayLeft = Math.ceil((nextBday-today)/1000/3600/24);
    return dayLeft;
     
  }

  
  function leftDaysInMonth (){
  
    const today = new Date();
    let cm = today.getMonth();
    let dayToday = today.getDate();
    let monthEnds=0;
                
    if(cm===1){
 if(today.getFullYear()%4===0 && today.getFullYear()%100!==0){
   monthEnds=29
 }
   else{
     monthEnds=28
   }
    }
    else if(cm===0 || cm === 2 || cm===4 || cm === 6 || cm ===7 || cm === 9 || cm === 11){
     monthEnds=31
    }
    else{
      monthEnds=30
    }
    
      return(monthEnds-dayToday)
   } 

 bot.hears("Найближчий тиждень",ctx =>{
    fsm='';
    
    let weekArr = [];
    for(let i = 0; i<users.length; i++){

        console.log('Увійшли')
        if(leftDays(users[i].user_bd_date)<=7 && leftDays(users[i].user_bd_date)>=0){
            weekArr.push(users[i]);
        }
    }

    if(weekArr.length !== 0){
        ctx.reply(formatArr(sortArr(weekArr)), {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: editButtons(weekArr)
        }  // Наприклад, для кнопок
    });  

    }
    else{
        ctx.reply('Найближчий тиждень без хепібьоздеїв');
    }
    
});

bot.hears("Найближчий місяць",ctx =>{
    fsm='';
    let today = new Date();
    
    let monthArr = [];
    for(let i = 0; i<users.length; i++){

        console.log('month'+leftDaysInMonth())
        if(leftDays(users[i].user_bd_date) <= leftDaysInMonth()){
            monthArr.push(users[i]);
            console.log('check here: '+leftDays(users[i].user_bd_date),leftDaysInMonth())
        }
    }
    

    if(monthArr.length > 0){
        ctx.reply(formatArr(sortArr(monthArr)), {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: editButtons(monthArr)
            }  // Наприклад, для кнопок
        }); 

    }
    else{
        ctx.reply('Найближчий місяць без хепібьоздеїв');
    }
    
});

bot.hears("До кінця року",ctx =>{
    fsm='';
    const today = new Date();
    let currentYear = today.getFullYear();
    let yearArr = [];
    for(let i = 0; i<users.length; i++){
        let endOfYear = new Date(currentYear,11,32)
        if(leftDays(endOfYear)> leftDays(users[i].user_bd_date) && leftDays(users[i].user_bd_date)>=0){
            yearArr.push(users[i]);
        }
    }

    if(yearArr.length !== 0){
        ctx.reply(formatArr(sortArr(yearArr)), {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: editButtons(yearArr)
            }  
        }); 

    }
    else{
        ctx.reply('До кінця року ДН не передбачено))');
    }
    
});

bot.on("text",ctx =>{
    if(fsm.action==="edit_name"){
        let userIndex = fsm.userIndex;
        users[userIndex].user_name = ctx.message.text;
        ctx.reply(`Ім'я оновлене на ${ctx.message.text}`, getMenu());
        saveToFile(users,ctx);
        fsm.action='';
    }
    if(fsm.action==="edit_gift"){
        let userIndex = fsm.userIndex;
        users[userIndex].user_gift = ctx.message.text;
        ctx.reply(`Подарунок оновлений на ${ctx.message.text}`, getMenu());
        saveToFile(users,ctx);
        fsm.action='';
    }
        
    if(fsm.action==="edit_hobby"){
        let userIndex = fsm.userIndex;
        users[userIndex].user_hobby = ctx.message.text;
        ctx.reply(`Хобі оновлене на ${ctx.message.text}`, getMenu());
        saveToFile(users,ctx);
        fsm.action='';
    }
    
    
    if(fsm==='name'){
        user.user_name = ctx.message.text;
        console.log(user);
        strName  = "Ім'я: " + user.user_name + '\n'+
    'Дата народження: ' + user.user_bd+ '\n'+
    "Хобі: " + user.user_hobby + '\n'+
    "Ідея подарунку: " + user.user_gift;  
        ctx.reply('main menu',getMenuAdd());      
    }

    if(fsm === 'bday'){
        let day = +ctx.message.text;

        if(day>0 && day<32){
            user.user_bd = ctx.message.text;

            birthday.setDate(day+1);

            user.user_bd_date = new Date();
            user.user_bd_date.setDate(day);

            console.log(birthday);

            ctx.reply("обери місяць",monthsKeyboard());
        }
        
        console.log(user);
        strName  = "Ім'я: " + user.user_name + '\n'+
        'Дата народження: ' + user.user_bd+ '\n'+
        "Хобі: " + user.user_hobby + '\n'+
        "Ідея подарунку: " + user.user_gift; 
        ctx.reply('main menu',getMenuAdd());     
    }
    if(fsm === 'hobby'){
        user.user_hobby = ctx.message.text;
        console.log(user);
        strName  = "Ім'я: " + user.user_name + '\n'+
        'Дата народження: ' + user.user_bd+ '\n'+
        "Хобі: " + user.user_hobby + '\n'+
        "Ідея подарунку: " + user.user_gift; 
        ctx.reply('main menu',getMenuAdd());     
    }

    if(fsm === 'gift'){
        user.user_gift = ctx.message.text;
        console.log(user);
        strName  = "Ім'я: " + user.user_name + '\n'+
        'Дата народження: ' + user.user_bd+ '\n'+
        "Хобі: " + user.user_hobby + '\n'+
        "Ідея подарунку: " + user.user_gift; 
        ctx.reply('main menu',getMenuAdd());     
    }

    if(fsm==='year'){
        let today = new Date();
       if(bdayFlag===true){
        let a = ctx.message.text;

       user.user_bd += `-${a}`;
       birthday.setYear(a);

       user.user_bd_date.setYear(a);

       let bdayFlag = true
 
       console.log(birthday);
       }
        strName  = "Ім'я: " + user.user_name + '\n'+
    'Дата народження: ' + user.user_bd+ '\n'+
    "Хобі: " + user.user_hobby + '\n'+
    "Ідея подарунку: " + user.user_gift;  
    console.log(user);
    ctx.reply('main menu',getMenuAdd());
        
    }
});

bot.launch();

app.listen(PORT, () => console.log('Wow! My server is working on PORT' + PORT));