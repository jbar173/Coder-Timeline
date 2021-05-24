
function repo_api_call(){
    fetch('https://api.github.com/users/jbar173/repos/')
      .then(response => {
        console.log(response.json());
      })
      .then(repos => {
          console.log(repos);
        }
      )
  };

function render_data(account_data){
    var i = account_data.length;
    console.log("i: " + i);
  }

var y = repo_api_call();
render_data(y);
