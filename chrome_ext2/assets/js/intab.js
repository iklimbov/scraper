var includeFullAddress = true,
  includeArea = false,
  includeLinkedIn = true,
  includeH = true,
  includeIndeed = true,
  includeCoordinates = true;

var keys = Object.keys(localStorage);
var keys_count = keys.length;

document.getElementById("items_fetched").innerHTML +=
  "Items fetched: " + keys_count;
html =
  '<table class= "table-bordered table-striped table-sm display-table" style="text-align: left; ">';

while (keys_count--) {
  html += "<tr id='row_" + keys_count + "'>";
  html += "<td >" + (keys.length - keys_count) + "</td>";

  html +=
    "<td class = 'a_link'><img id = 'cell_" +
    keys_count +
    "'src='assets/images/highlighter.png' alt=''></td>";

  item = JSON.parse(localStorage.getItem(keys[keys_count]));
  item.name = item.name.replace('"', "");
  // INDEED
  indeed_search = item.name.replace(" ", "+");
  indeed_search =
    "https://www.indeed.com/companies/search?q=" +
    indeed_search +
    "&l=" +
    item.zip +
    "&from=discovery-cmp-search";
  // YELP
  yelp_search = encodeString(item.name);
  var yelp_search_location = "";
  try {
    yelp_search_location = encodeString(item.area);
  } catch (err) {}
  yelp_search =
    "https://www.yelp.com/search?find_desc=" +
    yelp_search +
    "&find_loc=" +
    yelp_search_location;
  // LINKEDIN
  linkedin_search = encodeString(item.name);
  linkedin_search =
    "https://www.linkedin.com/search/results/all/?keywords=" +
    linkedin_search +
    "&origin=GLOBAL_SEARCH_HEADER";
  html +=
    "<td><a  class='linkedin a_link' href='" +
    linkedin_search +
    "' target='_blank'><img src='assets/images/linkedin.png' alt='LinkedIn'></a></td>";
  //INDEED
  html +=
    "<td><a  class='indeed a_link' href='" +
    indeed_search +
    "' target='_blank'><img src='assets/images/indeed.png' alt='Indeed'></a></td>";
  if (item.website) {
    html +=
      "<td><a class='hunter a_link' href='https://hunter.io/search/" +
      item.website +
      "' target='_blank'><img src='assets/images/hunter.png' alt='Hunter'></a></td>";
  } else {
    html += "<td></td>";
  }
  //WEBSITE
  if (item.website) {
    html +=
      "<td><a class='yelp a_link' href='" +
      yelp_search +
      "' target='_blank'><img src='assets/images/yelp.png' alt='Yelp'></a></td>";
  } else {
    html += "<td></td>";
  }
  html +=
    "<td><div  class='a_link'><img id='copyweb_" +
    keys_count +
    "'src='assets/images/copy.png' alt='Copy website'></div></td>";
  html +=
    "<td><div id = 'website" +
    keys_count +
    "'>" +
    '<a href="http://www.' +
    item.website +
    '" target="_blank">' +
    item.website +
    "</a></div></td>";
  //PHONE
  html +=
    "<td><div class='copy' data-toggle='tooltip' title='Click to copy' id = 'phone" +
    keys_count +
    "'>" +
    item.phone +
    "</div></td>";
  html +=
    "<td><div class='copy' data-toggle='tooltip' title='Click to copy' id = 'name" +
    keys_count +
    "'>" +
    item.name +
    "</div>" +
    "</td>";
  //ADDRESS
  html +=
    "<td><div class='copy address' data-toggle='tooltip' title='Click to copy' id = 'address" +
    keys_count +
    "'>" +
    item.fulladdress +
    "</div></td>";
  //AREA
  html +=
    "<td><div class='copy area' data-toggle='tooltip' title='Click to copy' id = 'area" +
    keys_count +
    "'>" +
    item.area +
    "</div></td>";
  //COORDINATES
  html +=
    "<td><div class='copy coords' data-toggle='tooltip' title='Click to copy' id = 'coords" +
    keys_count +
    "'>" +
    item.lat +
    ", &nbsp;" +
    item.log +
    "</div></td>";
  html += "</tr>";
}
html += "</table>";

//ADD LISTENTERS FOR HIGHLIGHTING ROW, COPYING DATA
document.getElementById("counterResults").innerHTML = html;
var keys_count = keys.length;
while (keys_count--) {
  document
    .getElementById(`cell_${keys_count}`)
    .addEventListener("click", function (e) {
      highlightRow(e.target.id);
    });
  document
    .getElementById(`name${keys_count}`)
    .addEventListener("click", function (e) {
      CopyToClipboard(e.target.id);
    });
  document
    .getElementById(`address${keys_count}`)
    .addEventListener("click", function (e) {
      CopyToClipboard(e.target.id);
    });
  document
    .getElementById(`area${keys_count}`)
    .addEventListener("click", function (e) {
      CopyToClipboard(e.target.id);
    });
  document
    .getElementById(`website${keys_count}`)
    .addEventListener("click", function (e) {
      CopyToClipboard(e.target.id);
    });
  document
    .getElementById(`copyweb_${keys_count}`)
    .addEventListener("click", function (e) {
      CopyToClipboardWeb(e.target.id);
    });

  document
    .getElementById(`phone${keys_count}`)
    .addEventListener("click", function (e) {
      CopyToClipboard(e.target.id);
    });
  document
    .getElementById(`coords${keys_count}`)
    .addEventListener("click", function (e) {
      CopyToClipboard(e.target.id);
    });
}

function CopyToClipboardWeb(x) {
  containerid = "website" + x.substring(x.indexOf("_") + 1);
  CopyToClipboard(containerid);
}

function CopyToClipboard(containerid) {
  if (window.getSelection) {
    try {
      el = document.getElementById(containerid);
      el.style.color = "blue";
      navigator.clipboard.writeText(el.textContent);
      el.style.fontWeight = "bold";
      setTimeout(function () {
        el.style.fontWeight = "normal";
      }, 50);
    } catch (err) {}
  }
}

function deleteStoredResults() {
  document.getElementById("items_fetched").innerHTML = "";
  localStorage.clear();
  location.reload();
  (function () {
    var bg = chrome.extension.getBackgroundPage();
    bg.googleResults = [];
    bg.businesses = [];
  })();
}

function restore_options() {
  chrome.storage.sync.get(
    {
      includeAddress: false,
      includeArea: false,
      includeLinkedIn: true,
      includeH: true,
      includeY: true,
      includeIndeed: true,
      includeCoordinates: false,
    },
    function (items) {
      includeFullAddress = items.includeAddress;
      includeArea = items.includeArea;
      includeNoWeb = items.includeNoWeb;
      includeLinkedIn = items.includeLinkedIn;
      includeH = items.includeH;
      includeY = items.includeY;
      includeIndeed = items.includeIndeed;
      includeCoordinates = items.includeCoordinates;
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
      if (!includeIndeed) {
        var divsToHide = document.getElementsByClassName("indeed");
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
      if (!includeArea) {
        var divsToHide = document.getElementsByClassName("area");
        for (var i = 0; i < divsToHide.length; i++) {
          divsToHide[i].style.visibility = "hidden";
          divsToHide[i].style.display = "none";
        }
      }
      if (!includeCoordinates) {
        var divsToHide = document.getElementsByClassName("coords");
        for (var i = 0; i < divsToHide.length; i++) {
          divsToHide[i].style.visibility = "hidden";
          divsToHide[i].style.display = "none";
        }
      }
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);

function encodeString(str) {
  str = encodeURI(str);
  str = str.replace(" ", "%20");
  str = str.replace("&", "%26");
  return str;
}

function highlightRow(my_id) {
  var rowId = "row" + my_id.substring(my_id.indexOf("_"));
  if (
    document.getElementById(rowId).style.backgroundColor != "rgb(255, 255, 197)"
  ) {
    document.getElementById(rowId).style.backgroundColor = "#ffffc5";
  } else {
    document.getElementById(rowId).style.backgroundColor = "#ffffff";
  }
}
