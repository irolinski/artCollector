const showLoading = () => {

    document.querySelector('main').style.display = 'none'
    document.querySelector('#loading-div').style.display = 'block'
    document.querySelector('#collection-page-header').style.display = 'none'
    document.querySelector('.page-brand').style.display = 'none'
    // document.querySelector('body').style.backgroundColor = 'rgba(45, 31, 31, 0.244)'
    
    
    setTimeout(( () => {
    
        document.querySelector('main').style.display = 'block'
        document.querySelector('#loading-div').style.display = 'none'
        document.querySelector('#collection-page-header').style.display = 'inline-block'
        document.querySelector('.page-brand').style.display = 'inline-block'
    
    }), '800') ;
    
    
    
    let setDefault = () => { 
    
        var userTable = '<%- JSON.stringify(userTable) %>'
        var queryString = '<%- JSON.stringify(queryString) %>'
       
        if 
       (((!queryString.includes('added') && !queryString.includes('catalogue') && !queryString.includes('acquired') && !queryString.includes('arch-col') && !queryString.includes('forSale')) && (queryString.includes('archival-hide') || queryString.includes('archival-show') || queryString.includes('archival-showOnly')))) {
        localStorage.setItem('noBoxesChecked', true)} else { localStorage.removeItem('noBoxesChecked')};
    
        if (localStorage.getItem("defaultCollectionSettings") === null && localStorage.getItem("noBoxesChecked") === null) {
    
            // showLoading()
    
            const checkboxes = document.querySelectorAll(".category-check");
    
            for (let el of document.querySelectorAll('.category-check')) {
                if (!queryString.includes("1")){
                if (userTable.includes(el.name)){ el.checked = 1 } else { 
                    el.checked = 0 
            }          // new condition
    
        }}
    
            for (let o of document.querySelector("#archival-select")) {
               if (!queryString.includes("1")) {
                if (userTable.includes(o.value)){ o.selected = 1 } else {
                    o.selected = 0
                }
               }
            }
    
    
         document.querySelector('#collection_form').submit();
        //  if (localStorage.getItem("noBoxesChecked") === null ){
         localStorage.setItem("defaultCollectionSettings", true) //};
    
    } else {
        localStorage.removeItem('defaultCollectionSettings');
    }};
    };

    
    window.onload = (function(){
        setDefault()
    });
    