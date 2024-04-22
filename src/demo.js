import {Unbody} from "@unbody-io/ts-client";

const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchForm = document.getElementById("search-form");

const generativeInputPrompt = document.getElementById("generative-input-prompt");
const generativeInputContext = document.getElementById("generative-input-context");
const generativeResults = document.getElementById("generative-results");
const generativeForm = document.getElementById("generative-form");

const visualSearchInput = document.getElementById("visual-search-input");
const visualSearchResults = document.getElementById("visual-search-results");
const visualSearchForm = document.getElementById("visual-search-form");


const unbody = new Unbody({
    apiKey: "",
    projectId: "",
});


(async () => {
    console.log("start");
    const s = await unbody.get.googleDoc.select("title").exec();
    console.log(s)
})();

const search = async (e) => {
    e.preventDefault();
    const query = searchInput.value;

    searchResults.innerText = "Loading..."

    //
    // const {data} = await unbody
    //     .get
    //     .textBlocks
    //      .search(query)
    //     .exec();

    // console.log(data)

    // Fetch data from Unbody
    // set searchResults
}


const generative = async (e) => {
    e.preventDefault();

    const context = generativeInputContext.value;
    const prompt = generativeInputPrompt.value;

    generativeResults.innerText = "Loading..."

    const {data} = await unbody.get
        .imageBlock
        .similar


    // Fetch data from Unbody

    // set generativeResults
}

const visualSearch = async (e) => {
    e.preventDefault();

    const url = visualSearchInput.value;

    visualSearchResults.innerHTML = `<img src="${url}" style="width: 200px" />`

    const {data: {payload}} = await unbody.get
        .imageBlock.similar
        .image(url, { certainty: 0.8})
        .select("url")
        .exec();

    visualSearchResults.innerHTML += payload.map(img => `<img src="${img.url}" style="width: 200px" class="pt-2" />`).join("")
    // Fetch data from Unbody
    // set visualSearchResults
}


searchForm.addEventListener("submit", search, true);
generativeForm.addEventListener("submit", generative, true);
visualSearchForm.addEventListener("submit", visualSearch, true);

