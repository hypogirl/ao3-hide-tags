chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.count) document.getElementById("count").innerHTML = "Number of blocked fanfics: " + msg.count;
}
);

const block = document.getElementById("block");
block.addEventListener("click", () => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        const active_tab = tabs[0];
        for (i = 0; i < 50; i++) chrome.tabs.sendMessage(active_tab.id, {subject: "cookies", cookies: document.cookie});
    });
});

const parseCookie = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    if (v[1]) acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});

var cookies = new Object();
const blocked_tags = new Array();

if (document.cookie) {
    cookies = parseCookie(document.cookie);
    for (const cookie of Object.keys(cookies)) if (Number(cookies[cookie])) blocked_tags.push(cookie);
}

const checkboxes = document.getElementsByTagName("input");
update();

for (const checkbox of checkboxes) {
    if (checkbox.type == "text") continue;
    if (Number(cookies[checkbox.value])) checkbox.checked = true;
    checkbox.addEventListener("click", () => {
        if (checkbox.checked) {
            document.cookie = checkbox.value + "=" + "1";
            blocked_tags.indexOf(checkbox.value) == -1 && blocked_tags.push(checkbox.value);
        }
        else {
            document.cookie = checkbox.value + "=" + "0";
            blocked_tags.indexOf(checkbox.value) !== -1 && blocked_tags.splice(blocked_tags.indexOf(checkbox.value), 1);
        }
        update();
    });
}

const add_tag = document.getElementById("addtag");
const tag = document.getElementById("tag");
add_tag.addEventListener("click", () => {
    document.cookie = tag.value + "=" + "1";
    blocked_tags.indexOf(tag.value) == -1 && blocked_tags.push(tag.value);
    update();
});

const remove_tag = document.getElementById("removetag");
remove_tag.addEventListener("click", () => {
    document.cookie = tag.value + "=" + "0";
    blocked_tags.indexOf(tag.value) !== -1 && blocked_tags.splice(blocked_tags.indexOf(tag.value), 1);
    update();
});

function update() {
    const blocked_tags_elem = document.getElementById("blockedtags");
    blocked_tags_elem.innerHTML = new String();
    for (let i = 0; i < blocked_tags.length; i++) {
        if (i) blocked_tags_elem.innerHTML += ", ";
        blocked_tags_elem.innerHTML += blocked_tags[i];
    }
}