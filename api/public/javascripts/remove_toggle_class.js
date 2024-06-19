    



// toggle class js function

toggleClass = function(className, id1, id2, id3, id4) {    

    for (let i = 1; i < arguments.length; i++ ){
        let id = arguments[i]
    
        let el = document.getElementById(id);
        if (el.classList.contains(className)) {
            el.classList.remove(className)
        } else {
            el.classList.add(className)
        }
    }};
    
    // remove class js function
    
    removeClass = function(className, id) {

        for (let i = 1; i < arguments.length; i++ ){
            let id = arguments[i]
        
            let el = document.getElementById(id);
            if (el.classList.contains(className)) {
                el.classList.remove(className)
            }}

    };
    
    