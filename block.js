var count = 0;
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.subject != "cookies") return;

    var cookies = new Object();
	if (msg.cookies) cookies = parseCookie(msg.cookies);
    
    for (const key of Object.keys(cookies)) {
        if (Number(cookies[key]))
            if (warnings[key]) count += remove(warnings[key]);
            else count += remove([new RegExp(key, "gi")]);}
    
    function remove(regexs) {
        var temp_cont = 0;
        const works = document.getElementsByClassName("work index group")[0]
        for (const fanfiction of works.children)
            for (const regex of regexs)
                if (regex.test(fanfiction.innerHTML)) {
                    temp_cont++;
                    fanfiction.remove();
                    break;
                }
        return temp_cont;
    }
    
    chrome.runtime.sendMessage({subject: 'count', count: count});
	return true;
});


const warnings = {
    "19": [/rape/gi, /non.con.*/gi],
    "20": [/underage/gi],
}

const parseCookie = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    if (v[1]) acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
}, {});