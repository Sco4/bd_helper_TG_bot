import Markup from 'telegraf/markup';

export function getMenu(){
    return Markup.keyboard(
        [
            ['Додати друга','Подивитись друзів'],
            //['five😂😂😂😂😂']
        ]
    ).resize();
};

export function showFriendsFn(){
    return Markup.keyboard(
        [
            ['Подивитись всіх','Найближчий тиждень'],
            ['Найближчий місяць', 'До кінця року'],
            ["Головне меню"]
        ]
    ).resize();
};





let arrBut = [
    ["Ім'я",'Дата народження'],
    ["Хобі",'Ідея подарунку'],        //масив, що містить головне меню
    ["Запам'ятати друга"],
    ["Головне меню"]
];


export function getMenuAdd(){
    return Markup.keyboard(
       arrBut
    ).resize();
};



export function monthsKeyboard(){
    return Markup.inlineKeyboard(
    [
        [
            Markup.button.callback('січень','m01'),
            Markup.button.callback('лютий','m02'),
            Markup.button.callback('березень','m03')  
        ],
        [
            Markup.button.callback('квітень','m04'),
            Markup.button.callback('травень','m05'),
            Markup.button.callback('червень','m06')    
        ],
        [
            Markup.button.callback('липень','m07'),
            Markup.button.callback('серпень','m08'),
            Markup.button.callback('вересень','m09')  
        ],
        [
            Markup.button.callback('жовтень','m10'),
            Markup.button.callback('листопад','m11'),
            Markup.button.callback('грудень','m12')    
        ],

    ]
    );
};

export function likeDislikeKeyboard(){
    return Markup.inlineKeyboard(
        [
            Markup.button.callback('✅','like'),
            Markup.button.callback('❌','dislike') 
        ]
    );
};


export function deleteKeyboard(){
    return Markup.inlineKeyboard(
        [
            Markup.button.callback('✅ видалити','confirm_delete'),
            Markup.button.callback('❌ скасувати','cancel_delete') 
        ]
    );
};

export function editKeyboard(UI){
    return Markup.inlineKeyboard([
        [Markup.button.callback("Ім'я", `edit_name_${UI}`)],
        [Markup.button.callback("Дата народження", `edit_bday_${UI}`)],
        [Markup.button.callback("Хобі", `edit_hobby_${UI}`)],
        [Markup.button.callback("Ідея подарунку", `edit_gift_${UI}`)],
        [Markup.button.callback("Видалити", `delete_${UI}`)],
        
    ])
};

