(function () {

    let forms = document.querySelectorAll('.needs-validation')
    let prevButtonNewForm = document.getElementById('new-prev-button');

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            if (prevButtonNewForm){
                prevButtonNewForm.click()}
                
            }
    
            form.classList.add('was-validated')
        }, false)
        })


    }
    
    )()

    