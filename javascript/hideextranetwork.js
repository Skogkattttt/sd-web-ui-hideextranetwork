var config = null;
var keywordBasePath = "";
var hideKeywords = [];

// Parse the CSV file to extract keywords
function parseKeyWordCSV(str) {
    var arr = [];
    var insideQuotes = false;

    for (var row = 0, c = 0; c < str.length; c++) {
        var currentChar = str[c], nextChar = str[c + 1];
        arr[row] = arr[row] || [];
        if (currentChar == '"' && insideQuotes && nextChar == '"') { arr[row] += currentChar; ++c; continue; }
        if (currentChar == '"') { insideQuotes = !insideQuotes; continue; }
        if (currentChar == '\r' && nextChar == '\n' && !insideQuotes) { ++row; ++c; continue; }
        if (currentChar == '\n' && !insideQuotes) { ++row; continue; }
        if (currentChar == '\r' && !insideQuotes) { ++row; continue; }

        arr[row] += currentChar;
    }
    return arr;
}

// Read a file from a given path
async function readKeyWordFile(filePath, json = false, cache = false) {
    let response = await fetch(`file=${filePath}`);

    if (response.status != 200) {
        console.error(`Error loading file "${filePath}": ` + response.status, response.statusText);
        return null;
    }

    if (json)
        return await response.json();
    else
        return await response.text();
}

// Load CSV
async function loadKeywordsFromCSV(path) {
    let text = await readKeyWordFile(path);
    return parseKeyWordCSV(text);
}

// Load keywords from the file specified in the config
async function loadKeywords(config) {
    if (hideKeywords.length === 0 && config.hideKeywordFile && config.hideKeywordFile !== "None") {
        try {
            hideKeywords = await loadKeywordsFromCSV(`${keywordBasePath}/${config.hideKeywordFile}`);
        } catch (e) {
            console.error("Error loading hide keywords file: " + e);
            return;
        }
    }
}

// Sync options with the config
async function syncOptions() {
    let newConfig = {
        hideKeywordFile: opts["hide_keyWordFile"],
        activeHideShow: opts["hide_active"]
    }

    if (!config || newConfig.keyWordFile !== config.keyWordFile) {
        hideKeywords = [];
        await loadKeywords(newConfig);
    }

    config = newConfig;
}

// Check if the Hide & Show feature is enabled
function isEnabled() {
    return config.activeHideShow;
}

// Hide elements based on keywords
function hideExtraNetwork(keywords) {
    if (!isEnabled()) {
        return;
    }

    // Define the prefixes and model types for the elements to be searched
    let tabPrefixList = ["txt2img", "img2img"];
    let modelTypeList = ["textual_inversion", "hypernetworks", "checkpoints", "lora"];
    let cardIdSuffix = "cards";

    // Iterate through the elements and hide or show them based on the keywords
    for (const tabPrefix of tabPrefixList) {
        for (const modelType of modelTypeList) {
            let elementId = tabPrefix + "_" + modelType + "_" + cardIdSuffix;
            let element = gradioApp().getElementById(elementId);
            if (!element) {
                console.log("Cannot find element: " + elementId);
                continue;
            }

            let cards = element.querySelectorAll(".card");

            for (let card of cards) {
                let onclickAttribute = card.getAttribute("onclick");
                try {
                    keywords.forEach(keyword => {
                        if (onclickAttribute && onclickAttribute.toLowerCase().includes(keyword.toLowerCase())) {
                            card.classList.add('!hidden');
                            throw {};
                        } else {
                            card.classList.remove('!hidden');
                        }
                    });
                } catch {}
            }
        }
    }
}

let waiting = false;
onUiUpdate(async () => {
    if (waiting) return;
    if (Object.keys(opts).length === 0) return;
    if (config) return;
    waiting = true;
    keywordBasePath = "extensions/sd-web-ui-hideextranetwork/keywords";

    await syncOptions();

    waiting = false;

    hideExtraNetwork(hideKeywords);
});
