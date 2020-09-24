var export_results = document.getElementById("export_results"),
  delete_results = document.getElementById("delete_results"),
  csv = "",
  includeFullAddress = false,
  includeAddress = false,
  includeDuplicates = false,
  includeNoWeb = false,
  includeLinkedIn = true,
  includeH = true,
  includeY = true,
  includeIndeed = true,
  includeCoordinates = false;

var keys = Object.keys(localStorage);
var keys_count = keys.length;

document.getElementById("download_data").addEventListener("click", function () {
  if (keys_count < 1) {
    return;
  }
  buildCsv(keys_count);
  downloadData();
});
document.getElementById("items_fetched").innerHTML +=
  "Items fetched: " + keys_count;

document.getElementById("open-new-tab").addEventListener("click", function () {
  chrome.tabs.create({ active: true, url: "./intab.html" });
});

function downloadData() {
  var cleanString = csv.replace(/[<>%{}|^~|&$%@()+]/g, " ");
  cleanString = cleanString.replace(/[\u0250-\ue007]/g, " ");
  var url = `data:application/csv;base64,${btoa(cleanString)}`;
  chrome.downloads.download({
    url: url,
    filename: "google_search_results.csv",
  });
}

delete_results.onclick = function () {
  csv = "";
  // document.getElementById("items_fetched").innerHTML = "";
  localStorage.clear();
  var status = document.getElementById("status");
  status.textContent = "Results deleted";
  document.getElementById("items_fetched").innerHTML = "Items fetched: 0";
  setTimeout(function () {
    status.textContent = "";
  }, 750);
  (function () {
    var bg = chrome.extension.getBackgroundPage();
    bg.googleResults = [];
    bg.businesses = [];
  })();
};

function restore_options() {
  chrome.storage.sync.get(
    {
      includeAddress: false,
      includeLinkedIn: true,
      includeH: true,
      includeY: true,
    },
    function (items) {
      includeFullAddress = items.includeAddress;
      includeNoWeb = items.includeNoWeb;
      includeLinkedIn = items.includeLinkedIn;
      includeH = items.includeH;
      includeY = items.includeY;
      if (!includeLinkedIn) {
        var divsToHide = document.getElementsByClassName("linkedin");
        for (var i = 0; i < divsToHide.length; i++) {
          divsToHide[i].style.visibility = "hidden";
          divsToHide[i].style.display = "none";
        }
      }
      if (!includeH) {
        var divsToHide = document.getElementsByClassName("hunter");
        for (var i = 0; i < divsToHide.length; i++) {
          divsToHide[i].style.visibility = "hidden";
          divsToHide[i].style.display = "none";
        }
      }
      if (!includeY) {
        var divsToHide = document.getElementsByClassName("yelp");
        for (var i = 0; i < divsToHide.length; i++) {
          divsToHide[i].style.visibility = "hidden";
          divsToHide[i].style.display = "none";
        }
      }
      if (!includeFullAddress) {
        var divsToHide = document.getElementsByClassName("address");
        for (var i = 0; i < divsToHide.length; i++) {
          divsToHide[i].style.visibility = "hidden";
          divsToHide[i].style.display = "none";
        }
      }
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);

function buildCsv(keys_count) {
  while (keys_count--) {
    var item = JSON.parse(localStorage.getItem(keys[keys_count]));
    csv +=
      '"' +
      (item.website ? item.website : "") +
      '"' +
      "," +
      '"' +
      (item.name ? item.name : "") +
      '"' +
      "," +
      '"' +
      (item.phone ? item.phone : "") +
      '"' +
      "," +
      '"' +
      (item.fulladdress ? item.fulladdress : "") +
      '"' +
      "," +
      '"' +
      (item.lat ? item.lat : "") +
      '"' +
      "," +
      '"' +
      (item.log ? item.log : "") +
      '"' +
      "," +
      '"' +
      (item.zip ? item.zip : "") +
      '"' +
      "," +
      '"' +
      (item.reviews ? item.reviews : "") +
      '"' +
      "," +
      '"' +
      (item.score ? item.score : "") +
      '"' +
      "," +
      '"' +
      (item.area ? item.area : "") +
      '"' +
      "," +
      '"' +
      (item.desc ? item.desc : "") +
      '"' +
      "\n";
  }
}
