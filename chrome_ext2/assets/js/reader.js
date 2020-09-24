var includeDuplicatResults = false,
  includeNoWeb = false;

document.addEventListener("DOMContentLoaded", function () {
  chrome.webRequest.onCompleted.addListener(
    (details) => {
      if (
        details.url.includes("search?tbm=map") ||
        details.url.includes("search/map")
      ) {
        const url = details.url;
        fetch(url)
          .then((response) => response.text())
          .then(function (html) {
            scrapeURL(url, html);
          });
      }
      {
        chrome.storage.sync.get(
          {
            includeDuplicates: false,
            includeNoWeb: false,
          },
          function (items) {
            this.includeDuplicatResults = items.includeDuplicates;
            this.includeNoWeb = items.includeNoWeb;
          }
        );
      }
    },
    {
      urls: ["https://www.google.com/*"],
      types: ["xmlhttprequest"],
    },
    []
  );
});

function scrapeURL(url, data) {
  try {
    var data = JSON.parse(data.slice(0, -6)).d.substr(4);
  } catch (err) {
    return;
  }
  data = JSON.parse(data)[0][1];
  var amount = data.length;
  for (i = 0; i < amount; i++) {
    if (data[i].length == 15) {
      var _name = data[i][14][11]
        .replace(/\,/g, " ")
        .replace(/\'/g, " ")
        .replace(/\"/g, " ");
      var _fulladdress = "",
        _phone = "",
        _website = "",
        _lat = "",
        _log = "",
        _area = "",
        _zip = "",
        _reviews = "",
        _score = "";
      // var _id =
      //   Math.random().toString(36).substring(2, 15) +
      //   Math.random().toString(36).substring(2, 15);
      _id = _website + _name + _lat + _log;
      try {
        _website = data[i][14][7][1];
      } catch (err) {
        if (includeNoWeb) {
          // we are still includeing this result
        } else {
          continue;
        }
      }
      try {
        _fulladdress = data[i][14][2].join(" ");
      } catch (err) {}
      try {
        _phone = data[i][14][178][0][0];
      } catch (err) {}
      try {
        _website = data[i][14][7][1];
      } catch (err) {}
      try {
        _lat = data[i][14][9][2];
      } catch (err) {}
      try {
        _log = data[i][14][9][3];
      } catch (err) {}
      try {
        _area = data[i][14][166];
      } catch (err) {}
      try {
        _zip = data[i][14][183][1][4];
      } catch (err) {}
      try {
        _reviews = data[i][14][4][8];
      } catch (err) {}
      try {
        _score = data[i][14][4][7];
      } catch (err) {}
      try {
        _desc = data[i][14][13];
      } catch (err) {}
      //CLEAN UP NULLS
      if (_desc == null) {
        _desc = "";
      }
      if (_name == null) {
        _name = "";
      }
      if (_fulladdress == null) {
        _fulladdress = "";
      }
      if (_phone == null) {
        _phone = "";
      }
      if (_website == null) {
        _website = "";
      }
      if (_id == null) {
        _id = "";
      }
      if (_lat == null) {
        _lat = "";
      }
      if (_log == null) {
        _log = "";
      }
      if (_zip == null) {
        _zip = "";
      }
      if (_reviews == null) {
        _reviews = "";
      }
      if (_score == null) {
        _score = "";
      }
      if (_area == null) {
        _area = "";
      }

      var values = {
        name: _name,
        fulladdress: _fulladdress,
        phone: _phone,
        website: _website,
        id: _id,
        lat: _lat,
        log: _log,
        zip: _zip,
        reviews: _reviews,
        score: _score,
        area: _area,
        desc: _desc,
      };

      if (!includeDuplicatResults) {
        localStorage.setItem(_website, JSON.stringify(values));
      } else {
        localStorage.setItem(_id, JSON.stringify(values));
      }
    }
  }
}
