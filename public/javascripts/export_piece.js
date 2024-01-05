




    


let pImage = document.querySelector('.image');

let pArtist = document.getElementById('artist-span').innerHTML.trim();
let pTitle = document.getElementById('title-span').innerHTML.trim();
let pCatNum = document.getElementById('catalogue-span').innerHTML.trim();
let pMedium = document.getElementById('medium-span').innerHTML.trim();
let pYear = document.getElementById('year-span').innerHTML.trim();
let pSize = document.getElementById('size-span').innerHTML.trim();
let pOwner = document.getElementById('owner-span').innerHTML.trim();
let pOContact = document.getElementById('o-contact-span').innerHTML.trim();
let pPrice = document.getElementById('price-span');

    pTitle += ', ';
let lineMedium = pMedium + ', ' + pSize;


let createCanvas_mus = function () {

    ls = 55 // line spacing in px
    text_X = 50;
    text_Y = 100; 
    

    let canvas = document.getElementById("canvas_mus");
    let ctx = canvas.getContext("2d");


    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1002, 682);
    ctx.fillStyle = "black";


    ctx.font = `bold 40px Lato`;
    ctx.fillStyle = "black";
    ctx.fillText(pArtist, text_X, text_Y);

    ctx.font = 'bold italic 40px Lato'
    ctx.fillText(pTitle, text_X, text_Y + ls);
    let titleWidth = ctx.measureText(pTitle).width;
    ctx.font = '40px Lato';
    ctx.fillText(pYear, text_X + titleWidth, text_Y + ls);

    ctx.fillStyle = "#212529bf";
    ctx.font = '28px Lato';
    ctx.fillText(lineMedium, text_X, text_Y + 1.75 * ls);

}

let createCanvas_cat = async function () {

    let canvas = document.getElementById("canvas_cat");
    let ctx = canvas.getContext("2d");


    if (!pCatNum == 0){
    pCatNum = 'Cat. ' + pCatNum;
    }

    if (!pOwner == 0){
        pOwner = 'Property of: ' + pOwner;
    }

    if (pPrice !== null) {
    pPrice = pPrice.innerHTML.trim();
    }

    let ls = 30; // line spacing
    let dbls = 50;

    let pieceInfo_X = 450;
    let pieceInfo_Y = 264;

    let ownerInfo_X = 450;
    let ownerInfo_Y = 516;

    let pieceImg_X = 75;
    let pieceImg_Y = 192;


    let catNum_X = ownerInfo_X + 200;
    let catNum_Y = 80;


    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1002, 682);
    ctx.fillStyle = "black";


    ctx.font = `20px Arial`;
    ctx.fillStyle = "#212529bf";
    ctx.fillText(pCatNum, catNum_X, catNum_Y);


    ctx.font = `bold 24px Lato`;
    ctx.fillStyle = "#000000";
    ctx.fillText(pArtist, pieceInfo_X, pieceInfo_Y);

    ctx.font = 'bold italic 24px Lato'
    ctx.fillText(pTitle, pieceInfo_X, pieceInfo_Y + dbls);
    let titleWidth = ctx.measureText(pTitle).width;
    ctx.font = '24px Lato';
    ctx.fillText(pYear, pieceInfo_X + titleWidth, pieceInfo_Y + dbls);

    ctx.fillStyle = "#212529bf";
    ctx.fillText(lineMedium, pieceInfo_X, pieceInfo_Y + 2 * dbls);

    ctx.font = '20px Lato';
    ctx.fillStyle = "#000000";
    ctx.fillText(pOwner, ownerInfo_X, ownerInfo_Y);
    ctx.fillText(pOContact, ownerInfo_X, ownerInfo_Y + ls);

    if (pPrice !== null){
        pPrice = `List price: ${pPrice}`;
    ctx.fillText(pPrice, ownerInfo_X, ownerInfo_Y + 2.5 * ls)
    };

    if (pImage){

        if (pImage.height > pImage.width){
        pieceImg_Y -= 75
    }

    let imageWidth = pImage.width * 0.65;
    let imageHeight = pImage.height * 0.65;

    if (imageWidth > 300) {
        imageWidth = 300};


    if (imageHeight > 450){
        imageHeight = 450
        };


    await ctx.drawImage(pImage, pieceImg_X, pieceImg_Y, imageWidth , imageHeight)
    };

}

createCanvas_mus();

if (pImage){
pImage.onload = setTimeout(createCanvas_cat(), 1000);
} else {
    createCanvas_cat();
}

let createCanvasLink = function (canvasId, linkId) {
$(linkId).click(function(){
    $(this).parent().attr('href', document.querySelector(canvasId).toDataURL());
    $(this).parent().attr('download', `${canvasId.substring(1)}_label_for_${pTitle}_by_${pArtist}.png`);    
});
}

createCanvasLink('#canvas_cat', '#export-cat');
createCanvasLink('#canvas_mus', '#export-mus');


    