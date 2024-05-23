import {Unbody} from "@unbody-io/ts-client";

const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchForm = document.getElementById("search-form");

const generativeInputPrompt = document.getElementById("generative-input-prompt");
const generativeInputContext = document.getElementById("generative-input-context");
const generativeResults = document.getElementById("generative-results");
const generativeForm = document.getElementById("generative-form");

const visualSimilarityInput = document.getElementById("visual-similarity-input");
const visualSimilarityResults = document.getElementById("visual-similarity-results");
const visualSimilarityForm = document.getElementById("visual-similarity-form");

const visualSearchInput = document.getElementById("visual-search-input")
const visualSearchResults = document.getElementById("visual-search-results")
const visualSearchForm = document.getElementById("visual-search-form")

const visualBtnSearch = document.getElementById("visual-search-button")
const visualBtnGenerative = document.getElementById("visual-search-generate-button")


const unbody = new Unbody({
    apiKey: "",
    projectId: "",
});



const imageCard = ({url, originalName, autoTypes}) => {
    if(!autoTypes)  return "";

    return `<div class="rounded-2xl max-h-[300px] overflow-hidden">
                <img src="${url}?w=300"/>
                <small class="text-xs text-gray-500">...${originalName}</small>
                <span class="text-xs">${autoTypes? autoTypes:""}</span>
           </div>`
}

(async () => {
   const {data: {payload}} = await unbody.get
       .imageBlock
       .select("autoCaption", "autoOCR","autoTypes", "url", "originalName")
       .exec();
   visualSearchResults.innerHTML = `
     <div class="grid grid-cols-6 gap-2">
        ${payload.map(imageCard).join("")}
     </div>`
})()



visualBtnSearch.addEventListener("click", async (e) => {
    const query = visualSearchInput.value;
    visualSearchResults.innerText = "Loading..."

    const {data: {payload}} = await unbody.get
        .imageBlock
        .select("autoCaption", "autoOCR","autoTypes", "url")
        .search
        .about(query, { certainty: 0.65})
        .exec();

    if (payload.length === 0) {
        visualSearchResults.innerText = "No results found"
        return
    }

    visualSearchResults.innerHTML = `
        <div class="rounded-2xl max-h-[400px] mr-auto ml-auto max-w-screen-md overflow-hidden mb-6 mt-6">
            <img src="${payload[0].url}?w=600" style="width: 100%">
        </div>
        <div class="grid grid-cols-6 gap-2">
            ${payload.slice(1, -1).map(imageCard).join("")}
        </div>
    `
});


visualBtnGenerative.addEventListener("click", async (e) => {
    const query = visualSearchInput.value;
    visualSearchResults.innerText = "Loading..."

    const {data: {payload, generate}} = await unbody.get
        .imageBlock
        .select("autoCaption", "autoOCR","autoTypes", "url")
        .search
        .about(query)
        .limit(2)
        .generate
        .fromMany(
            `${query}`,
            ["autoCaption", "autoOCR", "autoTypes"]
        )
        .exec();

    visualSearchResults.innerText = ""
    if (generate) {
        visualSearchResults.innerHTML += `<div class="whitespace-pre max-w-screen-md p-6">${generate.result}</div>`
    }

    visualSearchResults.innerHTML += `
        <div class="grid grid-cols-6 gap-2">
            ${payload.map(imageCard).join("")}
        </div>
    `
});











const search = async (e) => {
    e.preventDefault();
    const query = searchInput.value;

    searchResults.innerText = "Loading..."

    const {data: {payload}} = await unbody
        .get
        .googleDoc
        .select("title", "autoTopics")
        .search
        .about(query)
        .exec();

    console.log(payload)

    searchResults.innerHTML = ""
    payload.forEach(({title, autoTopics}) => {
        searchResults.innerHTML += `<li>${title}}</li>`
    })

}


const generative = async (e) => {
    e.preventDefault();

    const context = generativeInputContext.value;
    const prompt = generativeInputPrompt.value;

    generativeResults.innerText = "Loading..."

    const {data: {generate}} = await unbody.get
        .googleDoc
        .search
        .about(context)
        .limit(2)
        .select("title", "autoSummary")
        .generate
        .fromMany(
            prompt,
            ["title", "autoSummary", "autoTopics"]
        )
        .exec()

    generativeResults.innerText = generate.result;
}

const visualSimilarity = async (e) => {
    e.preventDefault();

    const url = visualSimilarityInput.value;

    visualSimilarityResults.innerHTML = `<img src="${url}" style="width: 200px" />`

    const {data: {payload}} = await unbody.get
        .imageBlock.similar
        .image(url, { certainty: 0.8})
        .select("url")
        .exec();

    visualSimilarityResults.innerHTML += payload.map(img => `<img src="${img.url}" style="width: 200px" class="pt-2" />`).join("")
    // Fetch data from Unbody
    // set visualSimilarityResults
}


searchForm.addEventListener("submit", search, true);
generativeForm.addEventListener("submit", generative, true);
visualSimilarityForm.addEventListener("submit", visualSimilarity, true);

