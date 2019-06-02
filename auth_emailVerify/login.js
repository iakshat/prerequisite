function clicked(e){
    e.preventDefault();
}

function senddata() {
    var username = document.getElementById("username");
    var password = document.getElementById("password");

    var data = {
        username : username,
        password : password
    };

    var request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        if(request.readyState == 4 && request.status == 200){
            console.log(request.response);
        }
    }
    request.open("POST", "/login", false);
    request.send(data);
}