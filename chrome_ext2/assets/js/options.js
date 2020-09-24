function save_options() {
  localStorage.clear();
  var includeAddress = document.getElementById("address").checked;
  var includeDuplicates = document.getElementById("duplicates").checked;
  var includeNoWeb = document.getElementById("noweb").checked;
  var includeLinkedIn = document.getElementById("include_li").checked;
  var includeH = document.getElementById("include_h").checked;
  var includeY = document.getElementById("include_y").checked;
  var includeIndeed = document.getElementById("include_indeed").checked;
  var includeCoordinates = document.getElementById("include_coordinates")
    .checked;
  var includeArea = document.getElementById("area").checked;

  chrome.storage.sync.set(
    {
      includeAddress: includeAddress,
      includeDuplicates: includeDuplicates,
      includeNoWeb: includeNoWeb,
      includeLinkedIn: includeLinkedIn,
      includeH: includeH,
      includeY: includeY,
      includeIndeed: includeIndeed,
      includeCoordinates: includeCoordinates,
      includeArea: includeArea,
    },
    function () {
      var status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
}
function restore_options() {
  chrome.storage.sync.get(
    {
      includeAddress: false,
      includeDuplicates: false,
      includeNoWeb: false,
      includeLinkedIn: true,
      includeH: true,
      includeY: true,
      includeIndeed: true,
      includeCoordinates: false,
      includeArea: false,
    },
    function (items) {
      document.getElementById("address").checked = items.includeAddress;
      document.getElementById("duplicates").checked = items.includeDuplicates;
      document.getElementById("noweb").checked = items.includeNoWeb;
      document.getElementById("include_li").checked = items.includeLinkedIn;
      document.getElementById("include_h").checked = items.includeH;
      document.getElementById("include_y").checked = items.includeY;
      document.getElementById("include_indeed").checked = items.includeIndeed;
      document.getElementById("include_coordinates").checked =
        items.includeCoordinates;
      document.getElementById("area").checked = items.includeArea;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
