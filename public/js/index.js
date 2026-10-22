content();
async function content() {
  const language =  await JSON.parse(getCookie("languageLM"));
  const data = "file/language.json";
  fetch(data)
    .then((response) => response.json())
    .then((data) => dataContent(data));
  function dataContent(data) {
    var filterLanguage = data.filter((filtercontent) => filtercontent.language == language);
    home = filterLanguage[0]["content"]["home"]
    welcome = filterLanguage[0]["content"]["welcome"]
    document.getElementById("homeIndex").innerHTML = home
    document.getElementById("welcomeIndex").innerHTML = welcome
    // document.getElementById("signoutindex").innerHTML = signout

  }
}
NameEmplyee()
async function NameEmplyee() {
  sessionFullName = await JSON.parse(getCookie("dataEmployeeLM"));
  fullName = sessionFullName["fullname"]
  document.getElementById("dashboardfullname").innerHTML = fullName;
}